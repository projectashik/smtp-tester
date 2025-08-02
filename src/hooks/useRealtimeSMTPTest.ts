import { useCallback, useRef, useState } from "react";
import {
  type LogEntry,
  type SMTPConfig,
  type TestResult,
  TestStatus,
} from "@/types/smtp";

interface UseRealtimeSMTPTestReturn {
  isConnected: boolean;
  isLoading: boolean;
  logs: LogEntry[];
  currentStatus: TestStatus;
  testResult: TestResult | null;
  error: string | null;
  startTest: (config: SMTPConfig) => void;
  stopTest: () => void;
  clearLogs: () => void;
}

export function useRealtimeSMTPTest(): UseRealtimeSMTPTestReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [currentStatus, setCurrentStatus] = useState<TestStatus>(
    TestStatus.IDLE
  );
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const stopTest = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setIsConnected(false);
    setIsLoading(false);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
    setTestResult(null);
    setError(null);
    setCurrentStatus(TestStatus.IDLE);
  }, []);

  const startTest = useCallback(
    (config: SMTPConfig) => {
      // Clean up any existing connections
      stopTest();

      // Reset state
      setLogs([]);
      setTestResult(null);
      setError(null);
      setCurrentStatus(TestStatus.CONNECTING);
      setIsLoading(true);

      // Create abort controller for the fetch request
      abortControllerRef.current = new AbortController();

      // Start the streaming request
      fetch("/api/smtp-test-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
        signal: abortControllerRef.current.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          if (!response.body) {
            throw new Error("No response body");
          }

          setIsConnected(true);

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          const readStream = async () => {
            try {
              while (true) {
                const { done, value } = await reader.read();

                if (done) {
                  break;
                }

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (const line of lines) {
                  if (line.startsWith("data: ")) {
                    try {
                      const data = JSON.parse(line.substring(6));

                      // Handle different event types
                      switch (data.type) {
                        case "log":
                          setLogs((prev) => [...prev, data as LogEntry]);
                          break;
                        case "status":
                          setCurrentStatus(data.status);
                          if (data.result) {
                            setTestResult(data.result);
                          }
                          break;
                        case "complete":
                          setTestResult(data.result);
                          setCurrentStatus(
                            data.result?.status || TestStatus.ERROR
                          );
                          setIsLoading(false);
                          setIsConnected(false);

                          // Close the connection
                          reader.cancel();
                          return; // Exit the function
                      }
                    } catch (parseError) {
                      console.error("Error parsing SSE data:", parseError);
                    }
                  }
                }
              }
            } catch (streamError) {
              if (
                streamError instanceof Error &&
                streamError.name !== "AbortError"
              ) {
                console.error("Stream reading error:", streamError);
                setError(streamError.message);
                setCurrentStatus(TestStatus.ERROR);
              }
            } finally {
              setIsLoading(false);
              setIsConnected(false);
            }
          };

          readStream();
        })
        .catch((fetchError) => {
          if (fetchError.name !== "AbortError") {
            console.error("Fetch error:", fetchError);
            setError(fetchError.message);
            setCurrentStatus(TestStatus.ERROR);
          }
          setIsLoading(false);
          setIsConnected(false);
        });
    },
    [stopTest]
  );

  return {
    isConnected,
    isLoading,
    logs,
    currentStatus,
    testResult,
    error,
    startTest,
    stopTest,
    clearLogs,
  };
}
