import { z } from "zod";

// Security options enum
export const SecurityType = {
  NONE: "none",
  TLS: "tls",
  SSL: "ssl",
  STARTTLS: "starttls",
} as const;

export type SecurityType = (typeof SecurityType)[keyof typeof SecurityType];

// SMTP Configuration Schema using Zod 3.x patterns
export const SMTPConfigSchema = z.object({
  host: z.string().min(1, "Host is required"),
  port: z.number().int().min(1).max(65535, "Port must be between 1 and 65535"),
  security: z.enum(["none", "tls", "ssl", "starttls"]),
  username: z.string().optional(),
  password: z.string().optional(),
  fromEmail: z.string().email("Invalid from email address"),
  fromName: z.string().optional(),
  toEmail: z.string().email("Invalid to email address"),
  toName: z.string().optional(),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  isHtml: z.boolean().default(false),
  timeout: z.number().int().min(1000).max(60000).default(30000),
  requireAuth: z.boolean().default(false),
  rejectUnauthorized: z.boolean().default(true),
});

export type SMTPConfig = z.infer<typeof SMTPConfigSchema>;

// Test Status enum
export const TestStatus = {
  IDLE: "idle",
  CONNECTING: "connecting",
  AUTHENTICATING: "authenticating",
  SENDING: "sending",
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type TestStatus = (typeof TestStatus)[keyof typeof TestStatus];

// Log Level enum
export const LogLevel = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  SUCCESS: "success",
  DEBUG: "debug",
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

// Log Entry interface
export interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  details?: Record<string, unknown>;
  duration?: number;
}

// Connection Details interface
export interface ConnectionDetails {
  host: string;
  port: number;
  security: SecurityType;
  connected: boolean;
  authenticated: boolean;
  connectionTime?: number;
  authTime?: number;
  serverInfo?: {
    greeting?: string;
    capabilities?: string[];
    version?: string;
  };
}

// Email Details interface
export interface EmailDetails {
  messageId?: string;
  from: string;
  to: string;
  subject: string;
  size: number;
  sent: boolean;
  sendTime?: number;
  response?: string;
}

// Test Result interface
export interface TestResult {
  id: string;
  timestamp: Date;
  status: TestStatus;
  success: boolean;
  totalDuration: number;
  config: Omit<SMTPConfig, "password">;
  connection: ConnectionDetails;
  email?: EmailDetails;
  logs: LogEntry[];
  error?: {
    code?: string;
    message: string;
    stack?: string;
    command?: string;
    response?: string;
  };
}

// API Response interface
export interface SMTPTestResponse {
  success: boolean;
  result?: TestResult;
  error?: string;
}

// Common SMTP Providers
export const SMTPProviders = {
  GMAIL: {
    name: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    security: "starttls" as SecurityType,
    requireAuth: true,
  },
  OUTLOOK: {
    name: "Outlook/Hotmail",
    host: "smtp-mail.outlook.com",
    port: 587,
    security: "starttls" as SecurityType,
    requireAuth: true,
  },
  YAHOO: {
    name: "Yahoo",
    host: "smtp.mail.yahoo.com",
    port: 587,
    security: "starttls" as SecurityType,
    requireAuth: true,
  },
  SENDGRID: {
    name: "SendGrid",
    host: "smtp.sendgrid.net",
    port: 587,
    security: "starttls" as SecurityType,
    requireAuth: true,
  },
  MAILGUN: {
    name: "Mailgun",
    host: "smtp.mailgun.org",
    port: 587,
    security: "starttls" as SecurityType,
    requireAuth: true,
  },
  AMAZON_SES: {
    name: "Amazon SES",
    host: "email-smtp.us-east-1.amazonaws.com",
    port: 587,
    security: "starttls" as SecurityType,
    requireAuth: true,
  },
  CUSTOM: {
    name: "Custom SMTP",
    host: "",
    port: 587,
    security: "starttls" as SecurityType,
    requireAuth: false,
  },
} as const;

export type SMTPProvider = keyof typeof SMTPProviders;

// Form State interface
export interface FormState {
  isSubmitting: boolean;
  lastResult?: TestResult;
  currentStatus: TestStatus;
}
