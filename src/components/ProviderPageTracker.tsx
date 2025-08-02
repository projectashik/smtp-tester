"use client";

import { useEffect } from "react";
import { useAnalytics } from "@/hooks/usePostHog";

interface ProviderPageTrackerProps {
  provider: string;
}

export default function ProviderPageTracker({ provider }: ProviderPageTrackerProps) {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.trackProviderPageViewed(provider);
  }, [analytics, provider]);

  return null;
}
