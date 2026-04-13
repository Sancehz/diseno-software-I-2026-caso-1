/**
 * Logger Service (Singleton Pattern)
 * 
 * Centralized logging service using Winston
 * Supports multiple transports and log levels
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { ConfigService } from '@config/config.service';

export class LoggerService {
  private static instance: LoggerService;
  private logger: winston.Logger;
  private config: ConfigService;

  private constructor() {
    this.config = ConfigService.getInstance();
    this.logger = this.createLogger();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  /**
   * Create Winston logger with configured transports
   */
  private createLogger(): winston.Logger {
    const { combine, timestamp, printf, colorize, errors } = winston.format;

    // Custom log format
    const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
      let msg = `${timestamp} [${level}]: ${message}`;
      
      if (Object.keys(metadata).length > 0) {
        msg += ` ${JSON.stringify(metadata)}`;
      }
      
      return msg;
    });

    const transports: winston.transport[] = [];

    // Console transport
    if (this.config.isDevelopment()) {
      transports.push(
        new winston.transports.Console({
          format: combine(colorize(), timestamp(), logFormat),
        })
      );
    }

    // File transport with rotation (if enabled)
    if (this.config.get('LOGGING_ENABLED')) {
      transports.push(
        new DailyRotateFile({
          filename: `${this.config.get('LOG_FILE_PATH')}/app-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: this.config.get('LOG_ROTATION_MAX_SIZE'),
          maxFiles: this.config.get('LOG_ROTATION_MAX_FILES'),
          format: combine(timestamp(), errors({ stack: true }), logFormat),
        })
      );

      // Separate error log file
      transports.push(
        new DailyRotateFile({
          filename: `${this.config.get('LOG_FILE_PATH')}/error-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          maxSize: this.config.get('LOG_ROTATION_MAX_SIZE'),
          maxFiles: this.config.get('LOG_ROTATION_MAX_FILES'),
          level: 'error',
          format: combine(timestamp(), errors({ stack: true }), logFormat),
        })
      );
    }

    return winston.createLogger({
      level: this.config.get('LOG_LEVEL'),
      transports,
      exitOnError: false,
    });
  }

  /**
   * Log info message
   */
  info(message: string, metadata?: any): void {
    this.logger.info(message, metadata);
  }

  /**
   * Log debug message
   */
  debug(message: string, metadata?: any): void {
    this.logger.debug(message, metadata);
  }

  /**
   * Log warning message
   */
  warn(message: string, metadata?: any): void {
    this.logger.warn(message, metadata);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | any, metadata?: any): void {
    if (error instanceof Error) {
      this.logger.error(message, {
        error: {
          message: error.message,
          stack: error.stack,
        },
        ...metadata,
      });
    } else {
      this.logger.error(message, { error, ...metadata });
    }
  }

  /**
   * Log with custom level
   */
  log(level: string, message: string, metadata?: any): void {
    this.logger.log(level, message, metadata);
  }

  /**
   * Get Winston logger instance (for advanced usage)
   */
  getLogger(): winston.Logger {
    return this.logger;
  }
}
