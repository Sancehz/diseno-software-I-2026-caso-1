/**
 * DUA Streamliner - Main Server Entry Point
 * 
 * Initializes the Express application with all middleware,
 * routes, and error handling. Starts the HTTP server and
 * establishes database connections.
 */

import express, { Application } from 'express';
import { ConfigService } from './config/config.service';
import { LoggerService } from './services/logger.service';
import { DatabaseService } from './services/database.service';
import { setupMiddleware } from './middlewares';
import { setupRoutes } from './routes';
import { setupErrorHandlers } from './middlewares/error.middleware';
import { MetricsService } from './services/metrics.service';
import { HealthCheckService } from './services/health-check.service';

class Server {
  private app: Application;
  private config: ConfigService;
  private logger: LoggerService;
  private database: DatabaseService;
  private metrics: MetricsService;
  private healthCheck: HealthCheckService;

  constructor() {
    this.app = express();
    this.config = ConfigService.getInstance();
    this.logger = LoggerService.getInstance();
    this.database = DatabaseService.getInstance();
    this.metrics = MetricsService.getInstance();
    this.healthCheck = HealthCheckService.getInstance();
  }

  /**
   * Initialize all services and start the server
   */
  async start(): Promise<void> {
    try {
      // Load configuration
      await this.config.initialize();
      this.logger.info('Configuration loaded successfully');

      // Initialize database connection
      await this.database.connect();
      this.logger.info('Database connected successfully');

      // Setup middleware stack
      setupMiddleware(this.app);
      this.logger.info('Middleware configured');

      // Setup API routes
      setupRoutes(this.app);
      this.logger.info('Routes configured');

      // Setup error handlers (must be last)
      setupErrorHandlers(this.app);
      this.logger.info('Error handlers configured');

      // Start metrics collection
      if (this.config.get('PROMETHEUS_ENABLED')) {
        await this.metrics.initialize();
        this.logger.info('Metrics service initialized');
      }

      // Start health check monitoring
      await this.healthCheck.start();
      this.logger.info('Health check service started');

      // Start HTTP server
      const port = this.config.get('PORT', 3000);
      this.app.listen(port, () => {
        this.logger.info(`Server running on port ${port}`);
        this.logger.info(`Environment: ${this.config.get('NODE_ENV')}`);
        this.logger.info(`API Version: ${this.config.get('API_VERSION')}`);
      });

    } catch (error) {
      this.logger.error('Failed to start server', error);
      await this.shutdown();
      process.exit(1);
    }
  }

  /**
   * Graceful shutdown handler
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down server...');

    try {
      // Stop health checks
      await this.healthCheck.stop();

      // Close database connections
      await this.database.disconnect();

      // Flush metrics
      if (this.config.get('PROMETHEUS_ENABLED')) {
        await this.metrics.shutdown();
      }

      this.logger.info('Server shutdown complete');
    } catch (error) {
      this.logger.error('Error during shutdown', error);
    }
  }
}

// Initialize and start server
const server = new Server();
server.start();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  await server.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await server.shutdown();
  process.exit(0);
});

// Handle unhandled errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});
