# DUA Streamliner Backend

Intelligent system for DUA (Declaración Única Aduanera) document processing and streamlining for Costa Rican customs operations.

## Architecture Overview

### Technology Stack
- **Runtime**: Node.js 18+
- **Framework**: Express.js (REST API)
- **Language**: TypeScript 5.4
- **Database**: PostgreSQL with Row-Level Security (RLS)
- **Storage**: AWS S3 (document archive)
- **Orchestration**: Kubernetes (AWS EKS)
- **Monitoring**: Prometheus + Grafana
- **Logging**: Winston with daily rotation

### Design Patterns
- **Singleton**: ConfigService, LoggerService, DatabaseService
- **Strategy**: DocumentParserStrategy (Word, Excel, PDF parsers)
- **Adapter**: DocumentDataAdapter (normalize parsed data)
- **Builder**: ReportBuilder (construct DUA reports)
- **Observer**: NotificationService (event notifications)

## Project Structure

```
backend/
├── src/
│   ├── adapters/              # Adapter pattern implementations
│   │   └── document-data.adapter.ts
│   ├── builders/              # Builder pattern implementations
│   │   └── report.builder.ts
│   ├── config/                # Configuration and RBAC
│   │   ├── config.service.ts  # Singleton config manager
│   │   └── rbac.config.ts     # Role-based access control
│   ├── controllers/           # HTTP request handlers
│   │   ├── auth.controller.ts
│   │   ├── file.controller.ts
│   │   ├── report.controller.ts
│   │   ├── template.controller.ts
│   │   └── user.controller.ts
│   ├── middlewares/           # Express middlewares
│   │   ├── index.ts
│   │   ├── authentication.middleware.ts
│   │   ├── authorization.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── geo-location.middleware.ts
│   │   ├── metrics.middleware.ts
│   │   ├── rate-limit.middleware.ts
│   │   └── request-logger.middleware.ts
│   ├── models/                # Data models and interfaces
│   │   ├── document-data.model.ts
│   │   └── user.model.ts
│   ├── repositories/          # Data access layer
│   │   ├── user.repository.ts
│   │   ├── file.repository.ts
│   │   ├── report.repository.ts
│   │   └── template.repository.ts
│   ├── routes/                # API route definitions
│   │   ├── index.ts
│   │   ├── auth.routes.ts
│   │   ├── file.routes.ts
│   │   ├── report.routes.ts
│   │   ├── template.routes.ts
│   │   └── user.routes.ts
│   ├── services/              # Business logic layer
│   │   ├── auth.service.ts
│   │   ├── database.service.ts
│   │   ├── file.service.ts
│   │   ├── health-check.service.ts
│   │   ├── logger.service.ts
│   │   ├── metrics.service.ts
│   │   ├── notification.service.ts
│   │   ├── report.service.ts
│   │   ├── s3.service.ts
│   │   └── template.service.ts
│   ├── strategies/            # Strategy pattern for document parsing
│   │   ├── document-parser.strategy.ts
│   │   ├── word-document-parser.strategy.ts
│   │   ├── excel-document-parser.strategy.ts
│   │   └── pdf-document-parser.strategy.ts
│   ├── utils/                 # Helper utilities
│   │   ├── crypto.util.ts
│   │   ├── file.util.ts
│   │   ├── jwt.util.ts
│   │   └── validation.util.ts
│   ├── validators/            # Request validation schemas
│   │   ├── auth.validator.ts
│   │   ├── file.validator.ts
│   │   └── report.validator.ts
│   ├── types/                 # TypeScript type definitions
│   │   └── express.d.ts
│   ├── scripts/               # Utility scripts
│   │   ├── migrate.ts
│   │   ├── seed.ts
│   │   └── generate-openapi.ts
│   └── server.ts              # Application entry point
├── tests/                     # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── migrations/                # Database migrations
├── k8s/                       # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   ├── secret.yaml
│   └── hpa.yaml
├── helm/                      # Helm charts
│   └── dua-streamliner/
├── .github/                   # GitHub Actions workflows
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
├── .env.example               # Environment variables template
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
├── jest.config.js
└── README.md
```

## Configuration & Parameters

### System Configuration
All system configurations, parameters, and policies are maintained in source code via:
- `.env.example` - Environment variable template
- `config.service.ts` - Configuration singleton with validation

### Resource Allocations

**Database (PostgreSQL)**:
- Min connections: 10
- Max connections: 100 (configurable)
- Idle timeout: 30 seconds
- Connection timeout: 5 seconds
- Row-Level Security: Enabled
- Encryption: AES-256

**Kubernetes**:
- Replicas: 3
- CPU Request: 500m
- CPU Limit: 1000m
- Memory Request: 512Mi
- Memory Limit: 1Gi

**File Processing**:
- Max payload size: 1MB (default)
- Max file upload size: 10MB
- Allowed types: .docx, .doc, .xlsx, .xls, .pdf, .jpg, .jpeg, .png

**Archive Policy**:
- Retention period: 30 days (S3)
- Archive storage: AWS S3

### Algorithm Parameters

**AI/ML Configuration**:
- OpenAI Model: gpt-4-turbo-preview
- Max tokens: 4096
- Temperature: 0.2
- OCR Language: spa+eng (Spanish + English)
- OCR Page Segmentation Mode: 3

**Confidence Thresholds**:
- Overall threshold: 0.75
- Minimum field confidence: 0.60
- Semantic similarity threshold: 0.80
- Fuzzy match threshold: 85

**Processing Limits**:
- Max concurrent reports: 5
- Report generation timeout: 300 seconds (5 minutes)
- Field validation strict mode: false
- Auto-correction: enabled

## Security

### Authentication
- JWT-based authentication
- Token expiration: 24 hours
- Refresh token: 7 days
- MFA support: Planned

### Authorization (RBAC)
Three user roles with distinct permissions:

1. **ADMIN**
   - Full system access
   - Manages users and templates
   - Monitors all processes

2. **SUPPORT**
   - View-only access to reports and logs
   - Respond to support tickets
   - No modification capabilities

3. **CUSTOMS_OFFICER**
   - Create and manage own DUA reports
   - Upload and process files
   - View own data only

### Policy-Based Access Control (PBAC)
- Geographic restriction: Costa Rica only
- IP-based filtering
- Geolocation validation

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token

### File Operations
- `POST /api/v1/files/upload` - Upload files for processing
- `GET /api/v1/files/:id` - Get file details
- `DELETE /api/v1/files/:id` - Delete file

### Report Operations
- `POST /api/v1/reports/generate` - Generate DUA report
- `GET /api/v1/reports/:id` - Get report
- `GET /api/v1/reports` - List reports
- `DELETE /api/v1/reports/:id` - Delete report

### Template Management (Admin only)
- `POST /api/v1/templates` - Create template
- `GET /api/v1/templates` - List templates
- `PUT /api/v1/templates/:id` - Update template
- `DELETE /api/v1/templates/:id` - Delete template

### User Management (Admin only)
- `POST /api/v1/users` - Create user
- `GET /api/v1/users` - List users
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

## Observability

### Prometheus Metrics
- Request count and latency
- Database connection pool stats
- File processing metrics
- Error rates

### Logging Events
- Login/logout events
- Failed login attempts
- File uploads and failures
- Report generation
- System errors

### Health Checks
- Database connectivity
- S3 connectivity
- System resource usage
- Application uptime

## Development

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- AWS account (S3 access)
- Docker (optional)

### Setup
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Run migrations
npm run migrate

# Seed database
npm run seed

# Start development server
npm run dev
```

### Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

### Linting & Formatting
```bash
# Lint code
npm run lint

# Format code
npm run format
```

## Deployment

### Docker
```bash
# Build image
docker build -t dua-streamliner-backend .

# Run container
docker run -p 3000:3000 dua-streamliner-backend
```

### Kubernetes
```bash
# Apply manifests
kubectl apply -f k8s/

# Or use Helm
helm install dua-streamliner ./helm/dua-streamliner
```

### CI/CD
- GitHub Actions workflows in `.github/workflows/`
- Automated testing on pull requests
- Automated deployment to staging/production

## Availability & Scaling

### Target Uptime
- 99.9% availability (~100 offline hours annually for maintenance)

### Single Points of Failure (Current)
- Single database instance (can be mitigated with ReplicaSets)
- No load balancer (can be added based on demand)
- No caching layer (Redis/Memcached can be added)

### Scaling Considerations
- Horizontal pod autoscaling configured in Kubernetes
- Database connection pool can be adjusted
- S3 storage scales automatically
- Additional replicas can be added as needed

## License
Proprietary - Sebastian Sanchez Delgado, Valeria Vargas Alvarado

## Authors
- Sebastian Sanchez Delgado (2023346349)
- Valeria Vargas Alvarado (2023044728)
