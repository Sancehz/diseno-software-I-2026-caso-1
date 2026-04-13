import * as Sentry from "@sentry/nextjs";
import type { AppError } from "@/exceptions/AppError";

/**
 * Logger — wraps Sentry for structured event/error emission.
 *
 * All layers (Services, ApiClients, Hooks) use this instead of console.error.
 * Errors are captured and forwarded to Azure Application Insights via Sentry
 * integration or directly via InsightsClient.
 */
export const logger = {
  error(error: AppError | Error, context?: Record<string, unknown>) {
    Sentry.captureException(error, { extra: context });
    if (process.env.NODE_ENV !== "production") {
      console.error(`[ERROR] ${error.message}`, context);
    }
  },

  info(message: string, context?: Record<string, unknown>) {
    Sentry.addBreadcrumb({ message, data: context, level: "info" });
    if (process.env.NODE_ENV !== "production") {
      console.info(`[INFO] ${message}`, context);
    }
  },

  warn(message: string, context?: Record<string, unknown>) {
    Sentry.addBreadcrumb({ message, data: context, level: "warning" });
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[WARN] ${message}`, context);
    }
  },
};
