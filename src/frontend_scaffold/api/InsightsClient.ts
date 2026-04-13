import { logger } from "@/logging/logger";

/**
 * InsightsClient — Azure Application Insights telemetry.
 * Forwards structured logs and events from the Logs layer.
 */
class _InsightsClient {
  trackEvent(name: string, properties?: Record<string, string>) {
    logger.info(`[Insights] ${name}`, properties);
    // TODO: integrate @azure/monitor-opentelemetry or applicationinsights SDK
  }

  trackException(error: Error, properties?: Record<string, string>) {
    logger.error(error, properties);
  }
}

export const InsightsClient = new _InsightsClient();
