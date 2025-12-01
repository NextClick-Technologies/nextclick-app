"use client";

import { useEffect } from "react";
import { captureError } from "@/shared/lib/error-monitoring";

/**
 * Global error handler component
 * Captures unhandled errors and promise rejections on the client
 */
export function GlobalErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();

      captureError(event.error || new Error(event.message), {
        source: "client",
        url: window.location.href,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();

      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));

      captureError(error, {
        source: "client",
        url: window.location.href,
        metadata: {
          promiseRejection: true,
        },
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}
