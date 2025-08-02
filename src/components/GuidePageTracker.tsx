"use client";

import { useEffect } from "react";
import { useAnalytics } from "@/hooks/usePostHog";

interface GuidePageTrackerProps {
  guide: string;
}

export default function GuidePageTracker({ guide }: GuidePageTrackerProps) {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.trackGuideViewed(guide);
  }, [analytics, guide]);

  return null;
}
