/**
 * Middleware Setup
 * 
 * Configures all Express middleware in correct order
 */

import { Application, json, urlencoded } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { ConfigService } from '@config/config.service';
import { rateLimitMiddleware } from './rate-limit.middleware';
import { requestLoggerMiddleware } from './request-logger.middleware';
import { authenticationMiddleware } from './authentication.middleware';
import { geoLocationMiddleware } from './geo-location.middleware';
import { metricsMiddleware } from './metrics.middleware';

export function setupMiddleware(app: Application): void {
  const config = ConfigService.getInstance();

  // Security headers
  app.use(helmet());

  // CORS configuration
  app.use(
    cors({
      origin: config.getCorsOrigins(),
      credentials: config.get('CORS_CREDENTIALS'),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Compression
  app.use(compression());

  // Body parsers with size limits
  app.use(json({ limit: config.get('MAX_PAYLOAD_SIZE') }));
  app.use(urlencoded({ extended: true, limit: config.get('MAX_PAYLOAD_SIZE') }));

  // Request logging
  app.use(requestLoggerMiddleware);

  // Metrics collection
  if (config.get('PROMETHEUS_ENABLED')) {
    app.use(metricsMiddleware);
  }

  // Rate limiting
  app.use(rateLimitMiddleware);

  // Geographic restriction (PBAC policy: Costa Rica only)
  if (config.get('GEOLOCATION_ENABLED')) {
    app.use(geoLocationMiddleware);
  }

  // Authentication (JWT validation)
  // Applied selectively to routes, not globally
  // See routes configuration for protected endpoints
}
