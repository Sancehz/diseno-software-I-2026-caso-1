/**
 * Configuration Service (Singleton Pattern)
 * 
 * Central configuration management for system parameters, policies,
 * resource allocations, and algorithm parameters. All configurations
 * are documented and maintained within source code.
 * 
 * Resource Allocations:
 * - Database: Max 100 concurrent connections (configurable)
 * - Memory: 512Mi request, 1Gi limit (K8s)
 * - CPU: 500m request, 1000m limit (K8s)
 * - File uploads: 10MB max size
 * - API payload: 1MB default
 */

import dotenv from 'dotenv';
import { z } from 'zod';

/**
 * Configuration Schema with validation
 */
const ConfigSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  API_VERSION: z.string().default('v1'),
  APP_NAME: z.string().default('dua-streamliner'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Security
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRATION: z.string().default('24h'),
  JWT_REFRESH_EXPIRATION: z.string().default('7d'),
  CORS_ORIGINS: z.string(),
  CORS_CREDENTIALS: z.coerce.boolean().default(true),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),
  ENCRYPTION_ALGORITHM: z.string().default('aes-256-gcm'),
  ENCRYPTION_KEY: z.string().min(32),

  // Database (PostgreSQL with connection pool limits)
  DB_HOST: z.string(),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_SSL: z.coerce.boolean().default(false),
  DB_POOL_MIN: z.coerce.number().default(10),
  DB_POOL_MAX: z.coerce.number().default(100),
  DB_POOL_IDLE_TIMEOUT_MS: z.coerce.number().default(30000),
  DB_POOL_CONNECTION_TIMEOUT_MS: z.coerce.number().default(5000),
  DB_RLS_ENABLED: z.coerce.boolean().default(true),

  // AWS S3
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),
  S3_BUCKET_REGION: z.string().default('us-east-1'),
  ARCHIVE_RETENTION_DAYS: z.coerce.number().default(30),

  // File Upload
  MAX_PAYLOAD_SIZE: z.coerce.number().default(1048576), // 1MB
  MAX_FILE_UPLOAD_SIZE: z.coerce.number().default(10485760), // 10MB
  ALLOWED_FILE_TYPES: z.string().default('.docx,.doc,.xlsx,.xls,.pdf,.jpg,.jpeg,.png'),
  UPLOAD_DIR: z.string().default('/tmp/dua-uploads'),

  // AI/ML Configuration
  OPENAI_API_KEY: z.string(),
  OPENAI_MODEL: z.string().default('gpt-4-turbo-preview'),
  OPENAI_MAX_TOKENS: z.coerce.number().default(4096),
  OPENAI_TEMPERATURE: z.coerce.number().default(0.2),
  OCR_LANGUAGE: z.string().default('spa+eng'),
  OCR_PAGE_SEGMENTATION_MODE: z.coerce.number().default(3),

  // RBAC & PBAC
  DEFAULT_USER_ROLE: z.enum(['ADMIN', 'SUPPORT', 'CUSTOMS_OFFICER']).default('CUSTOMS_OFFICER'),
  ALLOWED_COUNTRIES: z.string().default('CR'),
  GEOLOCATION_ENABLED: z.coerce.boolean().default(true),

  // Observability
  PROMETHEUS_ENABLED: z.coerce.boolean().default(true),
  PROMETHEUS_PORT: z.coerce.number().default(9090),
  GRAFANA_ENABLED: z.coerce.boolean().default(true),
  GRAFANA_PORT: z.coerce.number().default(3001),
  LOGGING_ENABLED: z.coerce.boolean().default(true),
  LOG_FILE_PATH: z.string().default('/var/log/dua-streamliner'),
  LOG_ROTATION_MAX_SIZE: z.string().default('10m'),
  LOG_ROTATION_MAX_FILES: z.coerce.number().default(14),
  TRACK_LOGIN_EVENTS: z.coerce.boolean().default(true),
  TRACK_FILE_UPLOADS: z.coerce.boolean().default(true),
  TRACK_REPORT_GENERATION: z.coerce.boolean().default(true),
  TRACK_FAILED_ATTEMPTS: z.coerce.boolean().default(true),

  // Availability & Scaling
  MAINTENANCE_MODE: z.coerce.boolean().default(false),
  HEALTH_CHECK_INTERVAL_MS: z.coerce.number().default(30000),
  K8S_NAMESPACE: z.string().default('dua-streamliner'),
  K8S_REPLICAS: z.coerce.number().default(3),
  K8S_CPU_REQUEST: z.string().default('500m'),
  K8S_CPU_LIMIT: z.string().default('1000m'),
  K8S_MEMORY_REQUEST: z.string().default('512Mi'),
  K8S_MEMORY_LIMIT: z.string().default('1Gi'),
  LOAD_BALANCER_ENABLED: z.coerce.boolean().default(false),
  CACHE_ENABLED: z.coerce.boolean().default(false),
  CACHE_TTL_SECONDS: z.coerce.number().default(3600),

  // DevOps
  ARCHIVE_CLEANUP_CRON: z.string().default('0 2 * * *'),
  DB_BACKUP_CRON: z.string().default('0 3 * * *'),
  METRICS_AGGREGATION_CRON: z.string().default('*/15 * * * *'),
  CI_CD_ENABLED: z.coerce.boolean().default(true),

  // Business Logic Algorithm Parameters
  CONFIDENCE_THRESHOLD: z.coerce.number().default(0.75),
  MIN_FIELD_CONFIDENCE: z.coerce.number().default(0.60),
  SEMANTIC_SIMILARITY_THRESHOLD: z.coerce.number().default(0.80),
  FUZZY_MATCH_THRESHOLD: z.coerce.number().default(85),
  MAX_CONCURRENT_REPORTS: z.coerce.number().default(5),
  REPORT_GENERATION_TIMEOUT_MS: z.coerce.number().default(300000),
  FIELD_VALIDATION_STRICT_MODE: z.coerce.boolean().default(false),
  AUTO_CORRECTION_ENABLED: z.coerce.boolean().default(true),

  // External Integration Points
  CUSTOMS_API_ENDPOINT: z.string().optional(),
  CUSTOMS_API_KEY: z.string().optional(),
  MINISTERIO_HACIENDA_ENDPOINT: z.string().optional(),
  WEBHOOK_ENABLED: z.coerce.boolean().default(false),
  WEBHOOK_RETRY_ATTEMPTS: z.coerce.number().default(3),
  WEBHOOK_TIMEOUT_MS: z.coerce.number().default(10000),
});

type Config = z.infer<typeof ConfigSchema>;

export class ConfigService {
  private static instance: ConfigService;
  private config: Config | null = null;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  /**
   * Initialize configuration from environment variables
   */
  async initialize(): Promise<void> {
    // Load .env file
    dotenv.config();

    try {
      // Validate and parse configuration
      this.config = ConfigSchema.parse(process.env);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Configuration validation failed:');
        error.errors.forEach((err) => {
          console.error(`  - ${err.path.join('.')}: ${err.message}`);
        });
      }
      throw new Error('Invalid configuration');
    }
  }

  /**
   * Get configuration value by key
   */
  get<K extends keyof Config>(key: K): Config[K];
  get<K extends keyof Config>(key: K, defaultValue: Config[K]): Config[K];
  get<K extends keyof Config>(key: K, defaultValue?: Config[K]): Config[K] {
    if (!this.config) {
      throw new Error('Configuration not initialized. Call initialize() first.');
    }

    const value = this.config[key];
    return value !== undefined ? value : (defaultValue as Config[K]);
  }

  /**
   * Get all configuration (for debugging only)
   */
  getAll(): Readonly<Config> {
    if (!this.config) {
      throw new Error('Configuration not initialized');
    }
    return Object.freeze({ ...this.config });
  }

  /**
   * Check if in production mode
   */
  isProduction(): boolean {
    return this.get('NODE_ENV') === 'production';
  }

  /**
   * Check if in development mode
   */
  isDevelopment(): boolean {
    return this.get('NODE_ENV') === 'development';
  }

  /**
   * Check if in test mode
   */
  isTest(): boolean {
    return this.get('NODE_ENV') === 'test';
  }

  /**
   * Get CORS origins as array
   */
  getCorsOrigins(): string[] {
    return this.get('CORS_ORIGINS').split(',').map(origin => origin.trim());
  }

  /**
   * Get allowed file types as array
   */
  getAllowedFileTypes(): string[] {
    return this.get('ALLOWED_FILE_TYPES').split(',').map(type => type.trim());
  }

  /**
   * Get allowed countries as array
   */
  getAllowedCountries(): string[] {
    return this.get('ALLOWED_COUNTRIES').split(',').map(country => country.trim());
  }

  /**
   * Get database connection configuration
   */
  getDatabaseConfig() {
    return {
      host: this.get('DB_HOST'),
      port: this.get('DB_PORT'),
      database: this.get('DB_NAME'),
      user: this.get('DB_USER'),
      password: this.get('DB_PASSWORD'),
      ssl: this.get('DB_SSL'),
      min: this.get('DB_POOL_MIN'),
      max: this.get('DB_POOL_MAX'),
      idleTimeoutMillis: this.get('DB_POOL_IDLE_TIMEOUT_MS'),
      connectionTimeoutMillis: this.get('DB_POOL_CONNECTION_TIMEOUT_MS'),
    };
  }

  /**
   * Get AWS S3 configuration
   */
  getS3Config() {
    return {
      region: this.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.get('AWS_SECRET_ACCESS_KEY'),
      },
      bucket: this.get('S3_BUCKET_NAME'),
      bucketRegion: this.get('S3_BUCKET_REGION'),
    };
  }

  /**
   * Get AI/ML algorithm parameters
   */
  getAlgorithmParams() {
    return {
      openai: {
        apiKey: this.get('OPENAI_API_KEY'),
        model: this.get('OPENAI_MODEL'),
        maxTokens: this.get('OPENAI_MAX_TOKENS'),
        temperature: this.get('OPENAI_TEMPERATURE'),
      },
      ocr: {
        language: this.get('OCR_LANGUAGE'),
        pageSegmentationMode: this.get('OCR_PAGE_SEGMENTATION_MODE'),
      },
      confidence: {
        threshold: this.get('CONFIDENCE_THRESHOLD'),
        minFieldConfidence: this.get('MIN_FIELD_CONFIDENCE'),
        semanticSimilarity: this.get('SEMANTIC_SIMILARITY_THRESHOLD'),
        fuzzyMatch: this.get('FUZZY_MATCH_THRESHOLD'),
      },
      processing: {
        maxConcurrentReports: this.get('MAX_CONCURRENT_REPORTS'),
        timeout: this.get('REPORT_GENERATION_TIMEOUT_MS'),
        strictValidation: this.get('FIELD_VALIDATION_STRICT_MODE'),
        autoCorrection: this.get('AUTO_CORRECTION_ENABLED'),
      },
    };
  }
}
