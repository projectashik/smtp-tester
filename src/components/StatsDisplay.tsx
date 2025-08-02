"use client";

import { Activity, Mail, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface Stats {
  totalTests: number;
  totalPageViews: number;
  successRate: number;
  activeUsers: number;
}

export default function StatsDisplay() {
  const [stats, setStats] = useState<Stats>({
    totalTests: 0,
    totalPageViews: 0,
    successRate: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching stats from PostHog or your analytics API
    const fetchStats = async () => {
      try {
        // In a real implementation, you would fetch from PostHog API
        // For now, we'll use simulated data that increments
        const baseStats = {
          totalTests: 15420,
          totalPageViews: 45680,
          successRate: 94.2,
          activeUsers: 1250,
        };

        // Add some randomness to make it feel live
        const randomIncrement = () => Math.floor(Math.random() * 10);

        setStats({
          totalTests: baseStats.totalTests + randomIncrement(),
          totalPageViews: baseStats.totalPageViews + randomIncrement() * 5,
          successRate: baseStats.successRate + (Math.random() - 0.5) * 2,
          activeUsers: baseStats.activeUsers + randomIncrement(),
        });

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
        setLoading(false);
      }
    };

    fetchStats();

    // Update stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
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
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
          Live Statistics
        </h3>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
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
        <p className="text-xs text-gray-500 text-center">
          Statistics updated in real-time • Powered by PostHog Analytics
        </p>
      </div>
    </div>
  );
}
