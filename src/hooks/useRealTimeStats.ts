"use client";

import { usePostHog } from "posthog-js/react";
import { useCallback, useEffect, useState } from "react";

interface Stats {
  totalTests: number;
  totalPageViews: number;
  successRate: number;
  activeUsers: number;
}

export function useRealTimeStats() {
  const [stats, setStats] = useState<Stats>({
    totalTests: 0,
    totalPageViews: 0,
    successRate: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const posthog = usePostHog();

  const fetchStats = useCallback(async () => {
    try {
      setError(null);

      // Try to fetch from our API endpoint first
      const response = await fetch("/api/analytics/stats");

      if (response.ok) {
        const data = (await response.json()) as Stats;

        // If we have PostHog client, try to get some real local data
        if (posthog) {
          // Get session storage for local tracking
          const localTests = parseInt(
            localStorage.getItem("smtp_tests_count") || "0"
          );
          const localSuccesses = parseInt(
            localStorage.getItem("smtp_success_count") || "0"
          );

          // Use real local data if available, otherwise use API data
          const enhancedStats = {
            ...data,
            totalTests:
              localTests > 0 ? data.totalTests + localTests : data.totalTests,
            successRate:
              localTests > 0
                ? (localSuccesses / localTests) * 100
                : data.successRate,
          };

          setStats(enhancedStats);
        } else {
          setStats(data);
        }
      } else {
        throw new Error("Failed to fetch from API");
      }

      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setError(err instanceof Error ? err.message : "Unknown error");

      // Fallback to enhanced dummy data
      const now = new Date();
      const hourOfDay = now.getHours();
      const dayOfWeek = now.getDay();

      // Simulate higher activity during business hours and weekdays
      const activityMultiplier =
        hourOfDay >= 9 && hourOfDay <= 17 && dayOfWeek >= 1 && dayOfWeek <= 5
          ? 1.5
          : 0.8;
      const randomVariation = () => Math.floor(Math.random() * 20) - 10;

      const fallbackStats = {
        totalTests: 15420 + Math.floor(Math.random() * 100),
        totalPageViews: 45680 + Math.floor(Math.random() * 500),
        successRate: Math.max(
          85,
          Math.min(98, 94.2 + (Math.random() - 0.5) * 4)
        ),
        activeUsers: Math.floor(1250 * activityMultiplier + randomVariation()),
      };

      setStats(fallbackStats);
      setLoading(false);
    }
  }, [posthog]);

  useEffect(() => {
    fetchStats();

    // Update stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  // Listen for PostHog events to update stats in real-time
  useEffect(() => {
    if (!posthog) return;

    const handleSMTPTest = () => {
      // Update localStorage
      const currentTests = parseInt(
        localStorage.getItem("smtp_tests_count") || "0"
      );
      localStorage.setItem("smtp_tests_count", (currentTests + 1).toString());

      setStats((prev) => ({
        ...prev,
        totalTests: prev.totalTests + 1,
      }));
    };

    const handlePageView = () => {
      setStats((prev) => ({
        ...prev,
        totalPageViews: prev.totalPageViews + 1,
      }));
    };

    const handleSMTPSuccess = () => {
      // Update localStorage
      const currentSuccesses = parseInt(
        localStorage.getItem("smtp_success_count") || "0"
      );
      localStorage.setItem(
        "smtp_success_count",
        (currentSuccesses + 1).toString()
      );

      setStats((prev) => {
        const newTotalTests = prev.totalTests;
        const currentSuccessful = Math.floor(
          (prev.successRate / 100) * newTotalTests
        );
        const newSuccessful = currentSuccessful + 1;
        const newSuccessRate =
          newTotalTests > 0 ? (newSuccessful / newTotalTests) * 100 : 0;

        return {
          ...prev,
          successRate: Math.min(100, newSuccessRate),
        };
      });
    };

    // Listen for custom events
    window.addEventListener("smtp-test-completed", handleSMTPTest);
    window.addEventListener("smtp-test-success", handleSMTPSuccess);
    window.addEventListener("$pageview", handlePageView);

    return () => {
      window.removeEventListener("smtp-test-completed", handleSMTPTest);
      window.removeEventListener("smtp-test-success", handleSMTPSuccess);
      window.removeEventListener("$pageview", handlePageView);
    };
  }, [posthog]);

  return { stats, loading, error, refetch: fetchStats };
}
