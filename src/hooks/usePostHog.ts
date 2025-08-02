"use client";

import { usePostHog } from "posthog-js/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface SMTPTestStartedProps {
  provider: string;
  host?: string;
  port?: number;
  security?: string;
  requireAuth?: boolean;
}

interface SMTPTestCompletedProps {
  provider: string;
  success: boolean;
  duration: number;
  status: string;
  errorType?: string;
  host?: string;
  port?: number;
}

interface SMTPTestErrorProps {
  provider: string;
  errorType: string;
  errorMessage: string;
  step: string; // connection, authentication, sending
  duration: number;
}

export function useAnalytics() {
  const posthog = usePostHog();
  const pathname = usePathname();

  // Track page views
  useEffect(() => {
    if (posthog && pathname) {
      posthog.capture("$pageview", {
        $current_url: window.location.href,
        path: pathname,
        title: document.title,
        timestamp: new Date().toISOString(),
      });
    }
  }, [posthog, pathname]);

  const trackSMTPTestStarted = (props: SMTPTestStartedProps) => {
    if (posthog) {
      posthog.capture("smtp_test_started", {
        provider: props.provider,
        host: props.host,
        port: props.port,
        security: props.security,
        require_auth: props.requireAuth,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href,
      });
    }
  };

  const trackSMTPTestCompleted = (props: SMTPTestCompletedProps) => {
    if (posthog) {
      posthog.capture("smtp_test_completed", {
        provider: props.provider,
        success: props.success,
        duration_ms: props.duration,
        status: props.status,
        error_type: props.errorType,
        host: props.host,
        port: props.port,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href,
      });

      // Also track as a conversion event if successful
      if (props.success) {
        posthog.capture("smtp_test_success", {
          provider: props.provider,
          duration_ms: props.duration,
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  const trackSMTPTestError = (props: SMTPTestErrorProps) => {
    if (posthog) {
      posthog.capture("smtp_test_error", {
        provider: props.provider,
        error_type: props.errorType,
        error_message: props.errorMessage,
        step: props.step,
        duration_ms: props.duration,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        page_url: window.location.href,
      });
    }
  };

  const trackProviderSelected = (provider: string) => {
    if (posthog) {
      posthog.capture("smtp_provider_selected", {
        provider,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
      });
    }
  };

  const trackGuideViewed = (guide: string) => {
    if (posthog) {
      posthog.capture("smtp_guide_viewed", {
        guide,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
      });
    }
  };

  const trackProviderPageViewed = (provider: string) => {
    if (posthog) {
      posthog.capture("smtp_provider_page_viewed", {
        provider,
        timestamp: new Date().toISOString(),
        page_url: window.location.href,
      });
    }
  };

  const trackFormFieldChanged = (field: string, value: any) => {
    if (posthog) {
      posthog.capture("smtp_form_field_changed", {
        field,
        value: typeof value === "string" ? value : JSON.stringify(value),
        timestamp: new Date().toISOString(),
      });
    }
  };

  const trackLogExpanded = (logId: string, logLevel: string) => {
    if (posthog) {
      posthog.capture("smtp_log_expanded", {
        log_id: logId,
        log_level: logLevel,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const trackResultsExported = (format: string, testSuccess: boolean) => {
    if (posthog) {
      posthog.capture("smtp_results_exported", {
        format,
        test_success: testSuccess,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return {
    trackSMTPTestStarted,
    trackSMTPTestCompleted,
    trackSMTPTestError,
    trackProviderSelected,
    trackGuideViewed,
    trackProviderPageViewed,
    trackFormFieldChanged,
    trackLogExpanded,
    trackResultsExported,
  };
}
