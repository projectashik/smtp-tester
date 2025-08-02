"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export default function Analytics() {
  useEffect(() => {
    // Initialize PostHog
    if (typeof window !== "undefined") {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_test_key", {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        loaded: (posthog) => {
          if (process.env.NODE_ENV === "development") posthog.debug();
        },
      });

      // Track page view
      posthog.capture("page_view", {
        path: window.location.pathname,
        url: window.location.href,
        title: document.title,
      });

      // Track SMTP test events
      const handleSMTPTestStart = (event: any) => {
        posthog.capture("smtp_test_started", {
          provider: event.detail?.provider || "unknown",
          timestamp: new Date().toISOString(),
        });
      };

      const handleSMTPTestComplete = (event: any) => {
        posthog.capture("smtp_test_completed", {
          provider: event.detail?.provider || "unknown",
          success: event.detail?.success || false,
          duration: event.detail?.duration || 0,
          timestamp: new Date().toISOString(),
        });
      };

      // Listen for custom events
      window.addEventListener("smtp-test-started", handleSMTPTestStart);
      window.addEventListener("smtp-test-completed", handleSMTPTestComplete);

      // Cleanup
      return () => {
        window.removeEventListener("smtp-test-started", handleSMTPTestStart);
        window.removeEventListener(
          "smtp-test-completed",
          handleSMTPTestComplete
        );
      };
    }
  }, []);

  return null;
}
