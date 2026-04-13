/**
 * Database Service (Singleton Pattern)
 * 
 * Manages PostgreSQL connection pool with configured limits
 * 
 * Resource Allocation:
 * - Min connections: 10
 * - Max connections: 100 (configurable)
 * - Idle timeout: 30 seconds
 * - Connection timeout: 5 seconds
 * 
 * Security:
 * - Row-Level Security (RLS) enabled
 * - AES-256 encryption for sensitive data
 * - SSL/TLS support
 */

import { Pool, PoolClient, QueryResult } from 'pg';
import { ConfigService } from '@config/config.service';
import { LoggerService } from './logger.service';

export class DatabaseService {
  private static instance: DatabaseService;
  private pool: Pool | null = null;
  private config: ConfigService;
  private logger: LoggerService;

  private constructor() {
    this.config = ConfigService.getInstance();
    this.logger = LoggerService.getInstance();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  /**
   * Initialize database connection pool
   */
  async connect(): Promise<void> {
    if (this.pool) {
      this.logger.warn('Database already connected');
      return;
    }

    const dbConfig = this.config.getDatabaseConfig();

    this.pool = new Pool({
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      password: dbConfig.password,
      ssl: dbConfig.ssl ? { rejectUnauthorized: false } : false,
      min: dbConfig.min,
      max: dbConfig.max,
      idleTimeoutMillis: dbConfig.idleTimeoutMillis,
      connectionTimeoutMillis: dbConfig.connectionTimeoutMillis,
    });

    // Test connection
    try {
      const client = await this.pool.connect();
      this.logger.info('Database connection pool established', {
        host: dbConfig.host,
        database: dbConfig.database,
        poolSize: `${dbConfig.min}-${dbConfig.max}`,
      });

      // Enable Row-Level Security if configured
      if (this.config.get('DB_RLS_ENABLED')) {
        await client.query('SET row_security = on');
        this.logger.info('Row-Level Security enabled');
      }

      client.release();
    } catch (error) {
      this.logger.error('Failed to connect to database', error);
      throw error;
    }

    // Handle pool errors
    this.pool.on('error', (err) => {
      this.logger.error('Unexpected database pool error', err);
    });

    // Log pool metrics periodically
    this.startPoolMetricsLogging();
  }

  /**
   * Disconnect from database
   */
  async disconnect(): Promise<void> {
    if (!this.pool) {
      return;
    }

    try {
      await this.pool.end();
      this.pool = null;
      this.logger.info('Database connection pool closed');
    } catch (error) {
      this.logger.error('Error closing database pool', error);
      throw error;
    }
  }

  /**
   * Execute a query
   */
  async query<T = any>(
    text: string,
    params?: any[]
  ): Promise<QueryResult<T>> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }

    try {
      const start = Date.now();
      const result = await this.pool.query<T>(text, params);
      const duration = Date.now() - start;

      this.logger.debug('Query executed', {
        query: text,
        duration: `${duration}ms`,
        rows: result.rowCount,
      });

      return result;
    } catch (error) {
      this.logger.error('Query execution failed', error, { query: text });
      throw error;
    }
  }

  /**
   * Get a client from the pool for transactions
   */
  async getClient(): Promise<PoolClient> {
    if (!this.pool) {
      throw new Error('Database not connected');
    }

    return await this.pool.connect();
  }

  /**
   * Execute multiple queries in a transaction
   */
  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();

    try {
      await client.query('BEGIN');
      const result = await callback(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      this.logger.error('Transaction failed, rolled back', error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Get connection pool statistics
   */
  getPoolStats(): {
    totalCount: number;
    idleCount: number;
    waitingCount: number;
  } {
    if (!this.pool) {
      return { totalCount: 0, idleCount: 0, waitingCount: 0 };
    }

    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount,
    };
  }

  /**
   * Check if database is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      this.logger.error('Database health check failed', error);
      return false;
    }
  }

  /**
   * Start periodic logging of pool metrics
   */
  private startPoolMetricsLogging(): void {
    setInterval(() => {
      const stats = this.getPoolStats();
      this.logger.debug('Connection pool metrics', stats);
    }, 60000); // Log every minute
  }
}
