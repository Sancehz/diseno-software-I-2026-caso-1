/**
 * API Routes Configuration
 * 
 * Registers all API routes with Express application
 * All routes are versioned under /api/v1
 */

import { Application } from 'express';
import authRoutes from './auth.routes';
import fileRoutes from './file.routes';
import reportRoutes from './report.routes';
import templateRoutes from './template.routes';
import userRoutes from './user.routes';
import { ConfigService } from '@config/config.service';

export function setupRoutes(app: Application): void {
  const config = ConfigService.getInstance();
  const apiVersion = config.get('API_VERSION');
  const basePath = `/api/${apiVersion}`;

  // Health check endpoint (no auth required)
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: apiVersion,
    });
  });

  // Readiness check endpoint (no auth required)
  app.get('/ready', async (req, res) => {
    // TODO: Check database connectivity, S3 connectivity, etc.
    res.status(200).json({
      status: 'ready',
      timestamp: new Date().toISOString(),
    });
  });

  // API routes
  app.use(`${basePath}/auth`, authRoutes);
  app.use(`${basePath}/files`, fileRoutes);
  app.use(`${basePath}/reports`, reportRoutes);
  app.use(`${basePath}/templates`, templateRoutes);
  app.use(`${basePath}/users`, userRoutes);

  // API documentation endpoint
  app.get(`${basePath}/docs`, (req, res) => {
    res.json({
      message: 'API Documentation',
      version: apiVersion,
      endpoints: {
        auth: `${basePath}/auth`,
        files: `${basePath}/files`,
        reports: `${basePath}/reports`,
        templates: `${basePath}/templates`,
        users: `${basePath}/users`,
      },
    });
  });

  // 404 handler for unmatched routes
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString(),
    });
  });
}
