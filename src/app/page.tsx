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
import { useState } from "react";
import RealtimeLogs from "@/components/RealtimeLogs";
import SMTPForm from "@/components/SMTPForm";
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
                <h1 className="text-xl font-bold text-gray-900">SMTP Tester</h1>
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
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Test Your SMTP Configuration
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive SMTP testing tool with detailed logging, real-time
            feedback, and support for all major email providers. Test
            connections, authentication, and email delivery with
            professional-grade diagnostics.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Real-time Testing
              </h3>
              <p className="text-gray-600 text-sm">
                Live connection monitoring with detailed progress tracking and
                instant feedback.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure & Private
              </h3>
              <p className="text-gray-600 text-sm">
                All tests run locally. Your credentials never leave your
                browser.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Detailed Logs
              </h3>
              <p className="text-gray-600 text-sm">
                Comprehensive logging with timing data, error details, and
                export options.
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
            <h3 className="text-lg font-semibold text-gray-900">
              Supported Providers
            </h3>
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
                    Quick Start Tips
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Select a provider preset or use custom settings</li>
                    <li>
                      • Enable authentication for most modern SMTP servers
                    </li>
                    <li>• Use STARTTLS for secure connections (recommended)</li>
                    <li>
                      • Check the detailed logs for troubleshooting information
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
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
                <p className="text-sm font-medium text-gray-900">SMTP Tester</p>
                <p className="text-xs text-gray-600">
                  Professional Email Testing
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
  );
}
