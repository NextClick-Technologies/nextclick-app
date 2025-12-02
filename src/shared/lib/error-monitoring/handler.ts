import { logger } from "@/shared/lib/logs/logger";
import { ErrorSeverity, type ErrorContext, type ErrorLog } from "./types";
import {
  logToSupabase,
  checkDuplicate,
  updateOccurrence,
  updateJiraLink,
  updateDiscordLink,
} from "./supabase";
import { notifyDiscord } from "./discord";
import { createJiraIssue } from "./jira";

const BOT_PATTERNS = ["bot", "crawler", "spider", "scrapy", "headless"];

/**
 * Main error capture function
 * Classifies, filters, logs, and notifies about errors
 */
export async function captureError(
  error: Error,
  context: ErrorContext
): Promise<void> {
  // Skip if error monitoring is disabled
  if (process.env.ENABLE_ERROR_MONITORING !== "true") {
    return;
  }

  try {
    // 1. Classify severity
    const severity = classifySeverity(error, context);

    // 2. Filter noise
    if (shouldIgnore(error, context, severity)) {
      logger.debug({ error: error.message, severity }, "Ignoring noise error");
      return;
    }

    // 3. Create error hash for deduplication
    const errorHash = createErrorHash(error);

    // 4. Check for duplicates
    const existing = await checkDuplicate(errorHash);

    if (existing) {
      await updateOccurrence(existing.id);
      logger.warn(
        { errorHash, id: existing.id, count: existing.occurrence_count + 1 },
        "Duplicate error occurrence"
      );
      return;
    }

    // 5. Log to Supabase
    const errorLog = await logToSupabase({
      error_hash: errorHash,
      severity,
      error_type: error.name || "Error",
      message: error.message,
      stack_trace: error.stack,
      source: context.source,
      url: context.url,
      method: context.method,
      user_id: context.userId,
      session_id: context.sessionId,
      user_agent: context.userAgent,
      ip_address: context.ipAddress,
      request_headers: context.metadata?.headers,
      request_body: context.metadata?.body,
    });

    logger.info(
      { errorId: errorLog.id, severity, errorType: error.name },
      "Logged new error"
    );

    // 6. Notify Discord if important
    if (
      severity === ErrorSeverity.CRITICAL ||
      severity === ErrorSeverity.HIGH
    ) {
      const messageId = await notifyDiscord(errorLog);
      if (messageId) {
        await updateDiscordLink(errorLog.id, messageId);
      }
    }

    // 7. Create Jira ticket for trackable errors
    if (
      severity !== ErrorSeverity.NOISE &&
      severity !== ErrorSeverity.LOW &&
      process.env.JIRA_HOST
    ) {
      const issueKey = await createJiraIssue(errorLog);
      if (issueKey) {
        await updateJiraLink(errorLog.id, issueKey);
        logger.info({ errorId: errorLog.id, issueKey }, "Created Jira ticket");
      }
    }
  } catch (monitoringError) {
    // Don't let error monitoring crash the app
    logger.error(
      { error: monitoringError },
      "Error in error monitoring system"
    );
  }
}

/**
 * Classify error severity based on error type and context
 */
export function classifySeverity(
  error: Error,
  context: ErrorContext
): ErrorSeverity {
  const message = error.message.toLowerCase();

  // Database connection errors = CRITICAL
  if (
    message.includes("econnrefused") ||
    message.includes("connection") ||
    message.includes("timeout") ||
    context.source === "database"
  ) {
    return ErrorSeverity.CRITICAL;
  }

  // 5xx errors = HIGH
  if (context.statusCode && context.statusCode >= 500) {
    return ErrorSeverity.HIGH;
  }

  // Auth/Payment routes = HIGH
  if (context.url) {
    const criticalRoutes = [
      "/auth/",
      "/payment/",
      "/api/auth/",
      "/api/payment/",
    ];
    if (criticalRoutes.some((route) => context.url?.includes(route))) {
      return ErrorSeverity.HIGH;
    }
  }

  // 404 = NOISE (will be filtered)
  if (context.statusCode === 404) {
    return ErrorSeverity.NOISE;
  }

  // 4xx client errors = MEDIUM
  if (
    context.statusCode &&
    context.statusCode >= 400 &&
    context.statusCode < 500
  ) {
    return ErrorSeverity.MEDIUM;
  }

  // Client-side errors
  if (context.source === "client") {
    // Auth/payment client errors = HIGH
    if (message.includes("auth") || message.includes("payment")) {
      return ErrorSeverity.HIGH;
    }
    return ErrorSeverity.MEDIUM;
  }

  return ErrorSeverity.MEDIUM;
}

/**
 * Determine if error should be ignored (noise filtering)
 */
export function shouldIgnore(
  error: Error,
  context: ErrorContext,
  severity: ErrorSeverity
): boolean {
  // Always ignore NOISE severity
  if (severity === ErrorSeverity.NOISE) {
    return true;
  }

  // Ignore bot traffic
  if (context.userAgent) {
    const ua = context.userAgent.toLowerCase();
    if (BOT_PATTERNS.some((bot) => ua.includes(bot))) {
      return true;
    }
  }

  // Ignore development environment by default
  // To test in dev, you must explicitly set ERROR_MONITORING_ENVIRONMENT=development
  if (
    process.env.NODE_ENV === "development" &&
    process.env.ERROR_MONITORING_ENVIRONMENT !== "development"
  ) {
    return true;
  }

  // Ignore hydration warnings unless they're frequent
  if (
    error.message.includes("Hydration") ||
    error.message.includes("hydration")
  ) {
    return true;
  }

  return false;
}

/**
 * Create hash for error deduplication
 * Based on error type + message + stack trace
 */
export function createErrorHash(error: Error): string {
  const stackLines = error.stack?.split("\n").slice(0, 5).join("\n") || "";
  const hashInput = `${error.name}|${error.message}|${stackLines}`;

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < hashInput.length; i++) {
    const char = hashInput.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return hash.toString(36);
}
