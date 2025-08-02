"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

interface PostHogProviderWrapperProps {
  children: React.ReactNode;
}

export default function PostHogProviderWrapper({
  children,
}: PostHogProviderWrapperProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

      if (posthogKey && posthogHost) {
        posthog.init(posthogKey, {
          api_host: posthogHost,
          person_profiles: "identified_only",
          loaded: (posthog) => {
            if (process.env.NODE_ENV === "development") {
              posthog.debug();
            }
          },
          capture_pageview: false, // We'll handle this manually
          capture_pageleave: true,
          session_recording: {
            recordCrossOriginIframes: true,
          },
        });
      }
    }
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
