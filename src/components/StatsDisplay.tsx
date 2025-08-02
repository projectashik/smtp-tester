"use client";

import {
  Activity,
  AlertCircle,
  Mail,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react";
import { useRealTimeStats } from "@/hooks/useRealTimeStats";

export default function StatsDisplay() {
  const { stats, loading, error, refetch } = useRealTimeStats();

  const simulateTest = () => {
    // Simulate an SMTP test for demo purposes
    window.dispatchEvent(new CustomEvent("smtp-test-completed"));

    // 85% chance of success (realistic for SMTP testing)
    if (Math.random() > 0.15) {
      window.dispatchEvent(new CustomEvent("smtp-test-success"));
    }
  };

  const simulatePageView = () => {
    // Simulate a page view
    window.dispatchEvent(new CustomEvent("$pageview"));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Live Statistics
        </h3>
        <div className="flex items-center space-x-3">
          {error && (
            <div className="flex items-center space-x-1 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs">Error loading</span>
            </div>
          )}
          <button
            type="button"
            onClick={simulateTest}
            className="flex items-center space-x-1 text-blue-500 hover:text-blue-700 transition-colors"
            title="Simulate SMTP test"
          >
            <Mail className="h-4 w-4" />
            <span className="text-xs">Demo Test</span>
          </button>
          <button
            type="button"
            onClick={simulatePageView}
            className="flex items-center space-x-1 text-green-500 hover:text-green-700 transition-colors"
            title="Simulate page view"
          >
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs">Demo View</span>
          </button>
          <button
            type="button"
            onClick={refetch}
            className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-xs">Refresh</span>
          </button>
          <div className="flex items-center space-x-1">
            <div
              className={`w-2 h-2 rounded-full ${
                error ? "bg-red-500" : "bg-green-500 animate-pulse"
              }`}
            ></div>
            <span className="text-xs text-gray-500">
              {error ? "Offline" : "Live"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(stats.totalTests)}
          </div>
          <div className="text-sm text-gray-600">SMTP Tests</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-2">
            <Activity className="h-6 w-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(stats.totalPageViews)}
          </div>
          <div className="text-sm text-gray-600">Page Views</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.successRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-2">
            <Users className="h-6 w-6 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatNumber(stats.activeUsers)}
          </div>
          <div className="text-sm text-gray-600">Active Users</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {error ? "Demo Mode" : "Live Mode"} • Powered by PostHog Analytics
          </p>
          {!error && (
            <div className="flex items-center space-x-1">
              <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Real-time</span>
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-gray-400 mt-1">
            Showing simulated data. Configure PostHog for real analytics.
          </p>
        )}
      </div>
    </div>
  );
}
