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
  Info,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LogEntry, LogLevel } from "@/types/smtp";

interface RealtimeLogsProps {
  logs: LogEntry[];
  isStreaming: boolean;
}

export default function RealtimeLogs({ logs, isStreaming }: RealtimeLogsProps) {
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());
  const [showLogs, setShowLogs] = useState(true);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (logsEndRef.current && isStreaming) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs.length, isStreaming]);

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const toggleLogExpansion = (logId: string) => {
    setExpandedLogs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(logId)) {
        newSet.delete(logId);
      } else {
        newSet.add(logId);
      }
      return newSet;
    });
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
        return "border-green-500 bg-green-50";
      case "error":
        return "border-red-500 bg-red-50";
      case "warning":
        return "border-yellow-500 bg-yellow-50";
      case "info":
        return "border-blue-500 bg-blue-50";
      case "debug":
        return "border-gray-500 bg-gray-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  if (logs.length === 0 && !isStreaming) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900 flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Real-time Logs ({logs.length})
          {isStreaming && (
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1"></div>
              Streaming
            </span>
          )}
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
          {logs.length === 0 && isStreaming && (
            <div className="p-6 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p>Waiting for logs...</p>
            </div>
          )}

          {logs.map((log, index) => (
            <div
              key={log.id}
              className={`border-l-4 p-4 ${getLogColor(log.level)} ${
                index !== logs.length - 1 ? "border-b border-gray-100" : ""
              } animate-fade-in`}
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

          {/* Auto-scroll anchor */}
          <div ref={logsEndRef} />
        </div>
      )}
    </div>
  );
}
