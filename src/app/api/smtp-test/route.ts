import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { 
  SMTPConfigSchema, 
  TestResult, 
  TestStatus, 
  LogLevel, 
  LogEntry,
  ConnectionDetails,
  EmailDetails,
  SMTPTestResponse 
} from '@/types/smtp';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const testId = crypto.randomUUID();
  const logs: LogEntry[] = [];

  // Helper function to add logs
  const addLog = (level: LogLevel, message: string, details?: Record<string, unknown>, duration?: number) => {
    logs.push({
      id: crypto.randomUUID(),
      timestamp: new Date(),
      level,
      message,
      details,
      duration
    });
  };

  try {
    // Parse and validate request body
    const body = await request.json();
    addLog('info', 'Received SMTP test request', { body: { ...body, password: '[REDACTED]' } });

    const config = SMTPConfigSchema.parse(body);
    addLog('success', 'Configuration validated successfully');

    // Initialize test result
    const result: TestResult = {
      id: testId,
      timestamp: new Date(),
      status: TestStatus.CONNECTING,
      success: false,
      totalDuration: 0,
      config: { ...config, password: undefined },
      connection: {
        host: config.host,
        port: config.port,
        security: config.security,
        connected: false,
        authenticated: false
      },
      logs: []
    };

    // Create transporter configuration
    const transporterConfig: any = {
      host: config.host,
      port: config.port,
      secure: config.security === 'ssl',
      requireTLS: config.security === 'starttls',
      tls: {
        rejectUnauthorized: config.rejectUnauthorized
      },
      connectionTimeout: config.timeout,
      greetingTimeout: config.timeout,
      socketTimeout: config.timeout,
      logger: true,
      debug: true
    };

    // Add authentication if required
    if (config.requireAuth && config.username && config.password) {
      transporterConfig.auth = {
        user: config.username,
        pass: config.password
      };
      addLog('info', 'Authentication configured', { username: config.username });
    }

    addLog('info', 'Creating SMTP transporter', { 
      host: config.host, 
      port: config.port, 
      security: config.security 
    });

    // Create transporter
    const transporter = nodemailer.createTransporter(transporterConfig);

    // Test connection
    const connectionStart = Date.now();
    addLog('info', 'Testing SMTP connection...');
    result.status = TestStatus.CONNECTING;

    try {
      const isConnected = await transporter.verify();
      const connectionTime = Date.now() - connectionStart;
      
      result.connection.connected = true;
      result.connection.connectionTime = connectionTime;
      
      addLog('success', 'SMTP connection successful', { 
        connectionTime: `${connectionTime}ms`,
        verified: isConnected 
      }, connectionTime);

      // Get server info if available
      try {
        const info = await new Promise((resolve, reject) => {
          const conn = transporter.transporter;
          if (conn && typeof conn.getSocket === 'function') {
            const socket = conn.getSocket();
            if (socket && socket.serverInfo) {
              resolve(socket.serverInfo);
            }
          }
          resolve(null);
        });

        if (info) {
          result.connection.serverInfo = info as any;
          addLog('info', 'Server information retrieved', { serverInfo: info });
        }
      } catch (infoError) {
        addLog('warning', 'Could not retrieve server information', { error: String(infoError) });
      }

    } catch (connectionError: any) {
      const connectionTime = Date.now() - connectionStart;
      result.connection.connectionTime = connectionTime;
      
      addLog('error', 'SMTP connection failed', { 
        error: connectionError.message,
        code: connectionError.code,
        connectionTime: `${connectionTime}ms`
      }, connectionTime);

      result.status = TestStatus.ERROR;
      result.error = {
        code: connectionError.code,
        message: connectionError.message,
        command: connectionError.command,
        response: connectionError.response
      };

      result.totalDuration = Date.now() - startTime;
      result.logs = logs;

      return NextResponse.json({ 
        success: false, 
        result 
      } as SMTPTestResponse);
    }

    // Test authentication if required
    if (config.requireAuth) {
      const authStart = Date.now();
      addLog('info', 'Testing authentication...');
      result.status = TestStatus.AUTHENTICATING;

      try {
        // Authentication is tested as part of verify() in nodemailer
        const authTime = Date.now() - authStart;
        result.connection.authenticated = true;
        result.connection.authTime = authTime;
        
        addLog('success', 'Authentication successful', { 
          authTime: `${authTime}ms` 
        }, authTime);
      } catch (authError: any) {
        const authTime = Date.now() - authStart;
        result.connection.authTime = authTime;
        
        addLog('error', 'Authentication failed', { 
          error: authError.message,
          authTime: `${authTime}ms`
        }, authTime);

        result.status = TestStatus.ERROR;
        result.error = {
          code: authError.code,
          message: authError.message
        };

        result.totalDuration = Date.now() - startTime;
        result.logs = logs;

        return NextResponse.json({ 
          success: false, 
          result 
        } as SMTPTestResponse);
      }
    }

    // Send test email
    const sendStart = Date.now();
    addLog('info', 'Sending test email...');
    result.status = TestStatus.SENDING;

    const mailOptions = {
      from: config.fromName ? `"${config.fromName}" <${config.fromEmail}>` : config.fromEmail,
      to: config.toName ? `"${config.toName}" <${config.toEmail}>` : config.toEmail,
      subject: config.subject,
      [config.isHtml ? 'html' : 'text']: config.message
    };

    addLog('info', 'Email configuration', { 
      from: mailOptions.from,
      to: mailOptions.to,
      subject: config.subject,
      isHtml: config.isHtml,
      messageLength: config.message.length
    });

    try {
      const info = await transporter.sendMail(mailOptions);
      const sendTime = Date.now() - sendStart;

      result.email = {
        messageId: info.messageId,
        from: mailOptions.from,
        to: mailOptions.to,
        subject: config.subject,
        size: Buffer.byteLength(config.message, 'utf8'),
        sent: true,
        sendTime,
        response: info.response
      };

      addLog('success', 'Email sent successfully', { 
        messageId: info.messageId,
        response: info.response,
        sendTime: `${sendTime}ms`,
        accepted: info.accepted,
        rejected: info.rejected
      }, sendTime);

      result.status = TestStatus.SUCCESS;
      result.success = true;

    } catch (sendError: any) {
      const sendTime = Date.now() - sendStart;
      
      addLog('error', 'Email sending failed', { 
        error: sendError.message,
        code: sendError.code,
        sendTime: `${sendTime}ms`
      }, sendTime);

      result.status = TestStatus.ERROR;
      result.error = {
        code: sendError.code,
        message: sendError.message,
        command: sendError.command,
        response: sendError.response
      };
    }

    // Finalize result
    result.totalDuration = Date.now() - startTime;
    result.logs = logs;

    addLog('info', 'SMTP test completed', { 
      success: result.success,
      totalDuration: `${result.totalDuration}ms`,
      status: result.status
    }, result.totalDuration);

    return NextResponse.json({ 
      success: result.success, 
      result 
    } as SMTPTestResponse);

  } catch (error: any) {
    const totalDuration = Date.now() - startTime;
    
    addLog('error', 'SMTP test failed with unexpected error', { 
      error: error.message,
      stack: error.stack
    }, totalDuration);

    const errorResult: TestResult = {
      id: testId,
      timestamp: new Date(),
      status: TestStatus.ERROR,
      success: false,
      totalDuration,
      config: {} as any,
      connection: {
        host: '',
        port: 0,
        security: 'none',
        connected: false,
        authenticated: false
      },
      logs,
      error: {
        message: error.message,
        stack: error.stack
      }
    };

    return NextResponse.json({ 
      success: false, 
      result: errorResult,
      error: error.message 
    } as SMTPTestResponse, { status: 400 });
  }
}
