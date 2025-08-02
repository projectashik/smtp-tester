"use client";

import {
  Activity,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Database,
  Download,
  Eye,
  EyeOff,
  Info,
  Mail,
  Server,
  Shield,
  User,
  XCircle,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { type LogLevel, type TestResult, TestStatus } from "@/types/smtp";

interface TestResultsProps {
  result: TestResult | null;
  currentStatus: TestStatus;
}

export default function TestResults({
  result,
  currentStatus,
}: TestResultsProps) {
  const [showLogs, setShowLogs] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  if (!result && currentStatus === TestStatus.IDLE) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Ready to Test
        </h3>
        <p className="text-gray-600">
          Configure your SMTP settings and click "Test SMTP Connection" to
          begin.
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: TestStatus) => {
    switch (status) {
      case TestStatus.SUCCESS:
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case TestStatus.ERROR:
        return <XCircle className="h-6 w-6 text-red-500" />;
      case TestStatus.CONNECTING:
      case TestStatus.AUTHENTICATING:
      case TestStatus.SENDING:
        return (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        );
      default:
        return <Info className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TestStatus) => {
    switch (status) {
      case TestStatus.SUCCESS:
        return "bg-green-50 border-green-200";
      case TestStatus.ERROR:
        return "bg-red-50 border-red-200";
      case TestStatus.CONNECTING:
      case TestStatus.AUTHENTICATING:
      case TestStatus.SENDING:
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getLogIcon = (level: LogLevel) => {
    switch (level) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "debug":
        return <Database className="h-4 w-4 text-gray-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getLogColor = (level: LogLevel) => {
    switch (level) {
      case "success":
        return "bg-green-50 border-l-green-500";
      case "error":
        return "bg-red-50 border-l-red-500";
      case "warning":
        return "bg-yellow-50 border-l-yellow-500";
      case "info":
        return "bg-blue-50 border-l-blue-500";
      case "debug":
        return "bg-gray-50 border-l-gray-500";
      default:
        return "bg-gray-50 border-l-gray-500";
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadResults = () => {
    if (!result) return;

    const data = {
      ...result,
      timestamp: result.timestamp.toISOString(),
      logs: result.logs.map((log) => ({
        ...log,
        timestamp: log.timestamp.toISOString(),
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `smtp-test-${result.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleLogExpansion = (logId: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId);
    } else {
      newExpanded.add(logId);
    }
    setExpandedLogs(newExpanded);
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div
        className={`rounded-xl border-2 p-6 ${getStatusColor(currentStatus)}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(currentStatus)}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {currentStatus === TestStatus.SUCCESS
                  ? "Test Successful"
                  : currentStatus === TestStatus.ERROR
                  ? "Test Failed"
                  : currentStatus === TestStatus.CONNECTING
                  ? "Connecting..."
                  : currentStatus === TestStatus.AUTHENTICATING
                  ? "Authenticating..."
                  : currentStatus === TestStatus.SENDING
                  ? "Sending Email..."
                  : "Test Status"}
              </h3>
              {result && (
                <p className="text-sm text-gray-600">
                  Completed in {formatDuration(result.totalDuration)}
                </p>
              )}
            </div>
          </div>

          {result && (
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {showDetails ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span>{showDetails ? "Hide" : "Show"} Details</span>
              </button>
              <button
                type="button"
                onClick={downloadResults}
                className="flex items-center space-x-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {result && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Connection
                </span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {result.connection.connected ? (
                  <span className="text-green-600">Connected</span>
                ) : (
                  <span className="text-red-600">Failed</span>
                )}
              </p>
              {result.connection.connectionTime && (
                <p className="text-xs text-gray-500">
                  {formatDuration(result.connection.connectionTime)}
                </p>
              )}
            </div>

            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Security
                </span>
              </div>
              <p className="text-lg font-semibold mt-1 capitalize">
                {result.connection.security}
              </p>
            </div>

            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Auth</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {result.connection.authenticated ? (
                  <span className="text-green-600">Success</span>
                ) : result.config.requireAuth ? (
                  <span className="text-red-600">Failed</span>
                ) : (
                  <span className="text-gray-600">N/A</span>
                )}
              </p>
              {result.connection.authTime && (
                <p className="text-xs text-gray-500">
                  {formatDuration(result.connection.authTime)}
                </p>
              )}
            </div>

            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Email</span>
              </div>
              <p className="text-lg font-semibold mt-1">
                {result.email?.sent ? (
                  <span className="text-green-600">Sent</span>
                ) : (
                  <span className="text-red-600">Failed</span>
                )}
              </p>
              {result.email?.sendTime && (
                <p className="text-xs text-gray-500">
                  {formatDuration(result.email.sendTime)}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Information */}
      {result && showDetails && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h4 className="text-lg font-medium text-gray-900">
              Detailed Information
            </h4>
          </div>

          <div className="p-6 space-y-6">
            {/* Connection Details */}
            <div>
              <h5 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                <Server className="h-5 w-5 mr-2" />
                Connection Details
              </h5>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Host:</span>{" "}
                    {result.connection.host}
                  </div>
                  <div>
                    <span className="font-medium">Port:</span>{" "}
                    {result.connection.port}
                  </div>
                  <div>
                    <span className="font-medium">Security:</span>{" "}
                    {result.connection.security.toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium">Connected:</span>{" "}
                    {result.connection.connected ? "Yes" : "No"}
                  </div>
                </div>

                {result.connection.serverInfo && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h6 className="font-medium text-gray-700 mb-2">
                      Server Information
                    </h6>
                    <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                      {JSON.stringify(result.connection.serverInfo, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Email Details */}
            {result.email && (
              <div>
                <h5 className="text-md font-medium text-gray-900 mb-3 flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Email Details
                </h5>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Message ID:</span>{" "}
                      {result.email.messageId || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">Size:</span>{" "}
                      {result.email.size} bytes
                    </div>
                    <div>
                      <span className="font-medium">From:</span>{" "}
                      {result.email.from}
                    </div>
                    <div>
                      <span className="font-medium">To:</span> {result.email.to}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Subject:</span>{" "}
                    {result.email.subject}
                  </div>
                  {result.email.response && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h6 className="font-medium text-gray-700 mb-2">
                        Server Response
                      </h6>
                      <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                        {result.email.response}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Error Details */}
            {result.error && (
              <div>
                <h5 className="text-md font-medium text-red-900 mb-3 flex items-center">
                  <XCircle className="h-5 w-5 mr-2" />
                  Error Details
                </h5>
                <div className="bg-red-50 rounded-lg p-4 space-y-2">
                  <div className="text-sm">
                    <div>
                      <span className="font-medium">Message:</span>{" "}
                      {result.error.message}
                    </div>
                    {result.error.code && (
                      <div>
                        <span className="font-medium">Code:</span>{" "}
                        {result.error.code}
                      </div>
                    )}
                    {result.error.command && (
                      <div>
                        <span className="font-medium">Command:</span>{" "}
                        {result.error.command}
                      </div>
                    )}
                  </div>
                  {result.error.response && (
                    <div className="mt-4 pt-4 border-t border-red-200">
                      <h6 className="font-medium text-red-700 mb-2">
                        Server Response
                      </h6>
                      <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
                        {result.error.response}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Logs */}
      {result && result.logs.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
            <h4 className="text-lg font-medium text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Test Logs ({result.logs.length})
            </h4>
            <button
              type="button"
              onClick={() => setShowLogs(!showLogs)}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {showLogs ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span>{showLogs ? "Hide" : "Show"} Logs</span>
            </button>
          </div>

          {showLogs && (
            <div className="max-h-96 overflow-y-auto">
              {result.logs.map((log, index) => (
                <div
                  key={log.id}
                  className={`border-l-4 p-4 ${getLogColor(log.level)} ${
                    index !== result.logs.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      {getLogIcon(log.level)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">
                            {log.message}
                          </span>
                          {log.duration && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDuration(log.duration)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </p>

                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() => toggleLogExpansion(log.id)}
                              className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              {expandedLogs.has(log.id) ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                              <span>Details</span>
                            </button>

                            {expandedLogs.has(log.id) && (
                              <div className="mt-2 p-3 bg-white rounded border">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-medium text-gray-700">
                                    Log Details
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      copyToClipboard(
                                        JSON.stringify(log.details, null, 2)
                                      )
                                    }
                                    className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                                <pre className="text-xs text-gray-600 overflow-x-auto">
                                  {JSON.stringify(log.details, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
