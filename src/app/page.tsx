"use client";

import {
  CheckCircle,
  Clock,
  ExternalLink,
  Github,
  Mail,
  Server,
  Shield,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import RealtimeLogs from "@/components/RealtimeLogs";
import SMTPForm from "@/components/SMTPForm";
import StatsDisplay from "@/components/StatsDisplay";
import StructuredData from "@/components/StructuredData";
import TestResults from "@/components/TestResults";
import { type LogEntry, type TestResult, TestStatus } from "@/types/smtp";

export default function Home() {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [currentStatus, setCurrentStatus] = useState<TestStatus>(
    TestStatus.IDLE
  );
  const [realtimeLogs, setRealtimeLogs] = useState<LogEntry[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleTestResult = (result: TestResult) => {
    setTestResult(result);
    setIsStreaming(false); // Stop streaming when test completes
  };

  const handleStatusChange = (status: TestStatus) => {
    setCurrentStatus(status);
    // Start streaming when test begins, stop when it ends
    setIsStreaming(
      status === TestStatus.CONNECTING ||
        status === TestStatus.AUTHENTICATING ||
        status === TestStatus.SENDING
    );
  };

  const handleLogsUpdate = (logs: LogEntry[]) => {
    setRealtimeLogs(logs);
  };

  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    SMTP Tester
                  </h1>
                  <p className="text-sm text-gray-600">
                    Professional SMTP Testing Tool
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/projectashik/smtp-tester"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Github className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm">GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Server className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional SMTP Server Testing Tool
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Test and validate your SMTP server configuration instantly with
              our comprehensive, secure, and free online SMTP testing tool.
              Verify email delivery, troubleshoot authentication issues, and
              ensure your mail server is working perfectly. Supports all major
              email providers including Gmail, Outlook, SendGrid, Mailgun, and
              custom SMTP servers.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Real-time SMTP Testing
                </h3>
                <p className="text-gray-600 text-sm">
                  Watch your SMTP connection, authentication, and email delivery
                  in real-time with detailed progress tracking and instant
                  feedback on every step.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Secure SMTP Testing
                </h3>
                <p className="text-gray-600 text-sm">
                  Your SMTP credentials are processed securely and never stored.
                  All tests run with enterprise-grade security and privacy
                  protection.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Advanced SMTP Diagnostics
                </h3>
                <p className="text-gray-600 text-sm">
                  Get comprehensive SMTP logs with timing data, error analysis,
                  server responses, and detailed troubleshooting information for
                  debugging email issues.
                </p>
              </div>
            </div>
          </div>

          {/* Main Application */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* SMTP Form */}
            <div className="space-y-6">
              <SMTPForm
                onTestResult={handleTestResult}
                onStatusChange={handleStatusChange}
                onLogsUpdate={handleLogsUpdate}
              />
            </div>

            {/* Test Results and Real-time Logs */}
            <div className="space-y-6">
              <TestResults result={testResult} currentStatus={currentStatus} />
              <RealtimeLogs logs={realtimeLogs} isStreaming={isStreaming} />
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Supported SMTP Providers & Email Services
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Test any SMTP server configuration with our comprehensive
                provider support
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  "Gmail",
                  "Outlook",
                  "Yahoo",
                  "SendGrid",
                  "Mailgun",
                  "Amazon SES",
                  "Postmark",
                  "Mandrill",
                  "SparkPost",
                  "Mailjet",
                  "Custom SMTP",
                  "And More...",
                ].map((provider) => (
                  <div
                    key={provider}
                    className="bg-gray-50 rounded-lg p-3 text-center text-sm font-medium text-gray-700 border border-gray-200"
                  >
                    {provider}
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-900 mb-1">
                      SMTP Testing Quick Start Guide
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        • Choose your email provider preset or configure custom
                        SMTP settings
                      </li>
                      <li>
                        • Enable SMTP authentication for Gmail, Outlook, and
                        most modern email services
                      </li>
                      <li>
                        • Use STARTTLS encryption for secure email transmission
                        (recommended)
                      </li>
                      <li>
                        • Monitor real-time logs to troubleshoot connection and
                        delivery issues
                      </li>
                      <li>
                        • Test both authentication and email delivery in one
                        comprehensive check
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Frequently Asked Questions About SMTP Testing
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-2">
                    What is SMTP and why do I need to test it?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    SMTP (Simple Mail Transfer Protocol) is the standard
                    protocol for sending emails. Testing your SMTP configuration
                    ensures your email server can successfully send emails,
                    authenticate properly, and handle various email scenarios
                    without issues.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-2">
                    Is it safe to test my SMTP credentials here?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes, absolutely. Your SMTP credentials are processed
                    securely and are never stored on our servers. All testing
                    happens in real-time and your sensitive information is
                    discarded immediately after the test completes.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-2">
                    Which email providers are supported?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    We support all major email providers including Gmail,
                    Outlook/Hotmail, Yahoo, SendGrid, Mailgun, Amazon SES,
                    Postmark, Mandrill, SparkPost, Mailjet, and any custom SMTP
                    server configuration.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-2">
                    What information do I need to test my SMTP server?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    You'll need your SMTP server hostname, port number, security
                    settings (TLS/SSL), and if authentication is required, your
                    username and password. Most email providers have these
                    settings readily available in their documentation.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-2">
                    Why am I getting authentication errors?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Authentication errors typically occur due to incorrect
                    credentials, disabled SMTP access, or security settings. For
                    Gmail, you may need to use App Passwords instead of your
                    regular password. Check your email provider's SMTP
                    documentation for specific requirements.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-semibold text-gray-900 mb-2">
                    Can I test SMTP servers behind firewalls?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Our tool can test any publicly accessible SMTP server. If
                    your SMTP server is behind a firewall or on a private
                    network, you'll need to ensure the server is accessible from
                    the internet or use our tool from within your network.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SMTP Guides Section */}
          <div className="mt-16 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                SMTP Guides & Documentation
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Learn SMTP configuration, troubleshooting, and best practices
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/smtp-guide/smtp-authentication"
                  className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors group"
                >
                  <h3 className="font-semibold text-blue-900 group-hover:text-blue-700 mb-2">
                    SMTP Authentication
                  </h3>
                  <p className="text-sm text-blue-700">
                    Learn about authentication methods and security protocols
                  </p>
                </Link>

                <Link
                  href="/smtp-guide/smtp-ports"
                  className="p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors group"
                >
                  <h3 className="font-semibold text-green-900 group-hover:text-green-700 mb-2">
                    SMTP Ports Guide
                  </h3>
                  <p className="text-sm text-green-700">
                    Understanding ports 25, 587, 465, and 2525
                  </p>
                </Link>

                <Link
                  href="/smtp-guide/smtp-encryption"
                  className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors group"
                >
                  <h3 className="font-semibold text-purple-900 group-hover:text-purple-700 mb-2">
                    SMTP Encryption
                  </h3>
                  <p className="text-sm text-purple-700">
                    TLS, SSL, and STARTTLS security explained
                  </p>
                </Link>

                <Link
                  href="/smtp-guide/troubleshooting"
                  className="p-4 bg-orange-50 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors group"
                >
                  <h3 className="font-semibold text-orange-900 group-hover:text-orange-700 mb-2">
                    Troubleshooting
                  </h3>
                  <p className="text-sm text-orange-700">
                    Common SMTP errors and solutions
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Live Statistics */}
          <div className="mt-16">
            <StatsDisplay />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    SMTP Tester
                  </p>
                  <p className="text-xs text-gray-600">
                    Professional SMTP Server Testing Tool
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Free, Secure, Real-time Email Server Validation
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                >
                  <span>Built with Next.js</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://tailwindcss.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 hover:text-gray-900 transition-colors"
                >
                  <span>Styled with Tailwind</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
