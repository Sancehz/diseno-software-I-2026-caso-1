# DUA Streamliner Backend - Quick Start Guide

## 📦 Package Contents

This backend skeleton includes:

✅ **Complete Architecture** - All design patterns implemented
✅ **75+ Files** - Controllers, services, models, routes, configs
✅ **Security Framework** - RBAC with 3 roles and 35+ permissions
✅ **Kubernetes Ready** - Deployment manifests with autoscaling
✅ **CI/CD Pipeline** - GitHub Actions workflows
✅ **100+ Configuration Parameters** - Fully documented
✅ **Algorithm Parameters** - AI/ML settings defined
✅ **Database Migrations** - PostgreSQL schema examples
✅ **Docker Support** - Multi-stage production builds

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ installed
- AWS account (for S3)
- Docker (optional)

### 1. Extract and Install

```bash
# Extract the zip file
unzip dua-streamliner-backend-skeleton.zip
cd backend

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your actual values
nano .env
```

**Required Environment Variables:**
- `JWT_SECRET` - Min 32 characters
- `ENCRYPTION_KEY` - Min 32 characters
- `DB_PASSWORD` - Your PostgreSQL password
- `AWS_ACCESS_KEY_ID` - AWS credentials
- `AWS_SECRET_ACCESS_KEY` - AWS credentials
- `OPENAI_API_KEY` - OpenAI API key

### 3. Setup Database

```bash
# Create database
createdb dua_streamliner

# Run migrations (implement first)
npm run migrate

# Seed initial data (implement first)
npm run seed
```

### 4. Run Development Server

```bash
# Start in development mode
npm run dev

# Server will start on http://localhost:3000
```

## 📋 Implementation Checklist

### Phase 1: Core Services (Week 1-2)
- [ ] Implement `AuthService` (JWT generation, password hashing)
- [ ] Implement `UserRepository` (database CRUD)
- [ ] Implement `AuthController` (login, logout, refresh)
- [ ] Implement authentication middleware (JWT validation)
- [ ] Write unit tests for auth flow

### Phase 2: File Processing (Week 3-4)
- [ ] Integrate `mammoth.js` in `WordDocumentParserStrategy`
- [ ] Integrate `xlsx` library in `ExcelDocumentParserStrategy`
- [ ] Implement `PDFDocumentParserStrategy` with OCR
- [ ] Implement `FileService` (orchestration)
- [ ] Implement `FileController` and `FileRepository`
- [ ] Test file upload and parsing

### Phase 3: Report Generation (Week 5-6)
- [ ] Complete `DocumentDataAdapter` field mappings
- [ ] Implement semantic enrichment (OpenAI integration)
- [ ] Complete `ReportBuilder` validation logic
- [ ] Implement `ReportService` (orchestration)
- [ ] Implement `ReportController` and `ReportRepository`
- [ ] Implement Word document generation for reports
- [ ] Test end-to-end report generation

### Phase 4: Template Management (Week 7)
- [ ] Implement `TemplateService`
- [ ] Implement `TemplateController` and `TemplateRepository`
- [ ] Create template CRUD operations
- [ ] Test template management

### Phase 5: User Management (Week 8)
- [ ] Implement `UserService`
- [ ] Implement `UserController` (already has repository)
- [ ] Implement authorization middleware (RBAC)
- [ ] Test user management with different roles

### Phase 6: External Integrations (Week 9)
- [ ] Implement `S3Service` (AWS SDK)
- [ ] Implement file archival (30-day retention)
- [ ] Integrate OpenAI API for semantic analysis
- [ ] Test external integrations

### Phase 7: Observability (Week 10)
- [ ] Implement Prometheus metrics collection
- [ ] Complete `MetricsService`
- [ ] Setup Grafana dashboards
- [ ] Implement structured logging
- [ ] Test health checks and monitoring

### Phase 8: Testing & QA (Week 11-12)
- [ ] Write unit tests (target 80% coverage)
- [ ] Write integration tests for all endpoints
- [ ] Write E2E tests for complete workflows
- [ ] Load testing and performance optimization
- [ ] Security audit

### Phase 9: Deployment (Week 13)
- [ ] Setup Kubernetes cluster (AWS EKS)
- [ ] Deploy to staging environment
- [ ] User acceptance testing
- [ ] Deploy to production
- [ ] Monitor and iterate

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── adapters/          # Adapter pattern (normalize data)
│   ├── builders/          # Builder pattern (construct reports)
│   ├── config/            # Configuration and RBAC
│   ├── controllers/       # HTTP request handlers (TO IMPLEMENT)
│   ├── middlewares/       # Express middlewares
│   ├── models/            # Data models
│   ├── repositories/      # Data access layer (TO IMPLEMENT)
│   ├── routes/            # API route definitions
│   ├── services/          # Business logic (PARTIALLY IMPLEMENTED)
│   ├── strategies/        # Strategy pattern (document parsers)
│   ├── utils/             # Helper utilities (TO IMPLEMENT)
│   ├── validators/        # Request validation (TO IMPLEMENT)
│   └── server.ts          # Entry point ✅
├── k8s/                   # Kubernetes manifests ✅
├── migrations/            # Database migrations
├── .github/workflows/     # CI/CD pipelines ✅
└── tests/                 # Test files (TO IMPLEMENT)
```

## 🔧 Key Files to Understand

### 1. Configuration (`src/config/config.service.ts`)
- Singleton pattern for configuration management
- Validates all environment variables with Zod
- Provides type-safe access to config

### 2. RBAC (`src/config/rbac.config.ts`)
- Defines 3 user roles: ADMIN, SUPPORT, CUSTOMS_OFFICER
- 35+ permissions fully documented
- Permission checking utilities

### 3. Strategies (`src/strategies/`)
- `DocumentParserStrategy` - Base class for parsers
- `WordDocumentParserStrategy` - Word document parser
- `ExcelDocumentParserStrategy` - Excel parser
- Ready to add PDF parser

### 4. Adapter (`src/adapters/document-data.adapter.ts`)
- Normalizes parsed data to DUA format
- Field mapping with aliases
- Confidence scoring

### 5. Builder (`src/builders/report.builder.ts`)
- Constructs complete DUA reports
- Validates data against business rules
- Flags low-confidence fields

## 📝 Environment Variables

See `.env.example` for complete list. Key sections:

### Application
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default 3000)

### Database
- `DB_HOST`, `DB_PORT`, `DB_NAME` - PostgreSQL connection
- `DB_POOL_MAX` - Max connections (default 100)

### Security
- `JWT_SECRET` - JWT signing key
- `ALLOWED_COUNTRIES` - Geographic restriction (default: CR)

### AI/ML
- `OPENAI_MODEL` - Model to use (default: gpt-4-turbo-preview)
- `CONFIDENCE_THRESHOLD` - Overall threshold (default: 0.75)

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## 🐳 Docker

```bash
# Build image
docker build -t dua-streamliner-backend .

# Run container
docker run -p 3000:3000 --env-file .env dua-streamliner-backend
```

## ☸️ Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace dua-streamliner

# Apply secrets (update k8s/secret.yaml first!)
kubectl apply -f k8s/secret.yaml

# Apply config
kubectl apply -f k8s/configmap.yaml

# Deploy application
kubectl apply -f k8s/deployment.yaml

# Check status
kubectl get pods -n dua-streamliner
kubectl logs -f deployment/dua-streamliner-backend -n dua-streamliner
```

## 🔍 API Endpoints

Once implemented, the API will expose:

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token

### Files
- `POST /api/v1/files/upload` - Upload files
- `GET /api/v1/files` - List files
- `DELETE /api/v1/files/:id` - Delete file

### Reports
- `POST /api/v1/reports/generate` - Generate DUA report
- `GET /api/v1/reports/:id` - Get report
- `GET /api/v1/reports/:id/download` - Download report

### Templates (Admin)
- `GET /api/v1/templates` - List templates
- `POST /api/v1/templates` - Create template

### Users (Admin)
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user

### Health
- `GET /health` - Health check
- `GET /ready` - Readiness check

## 📊 Monitoring

### Prometheus Metrics
Available at `http://localhost:9090/metrics` when enabled

### Grafana Dashboards
Connect to Prometheus and import dashboards for:
- Request rates and latency
- Database connection pool
- File processing metrics
- Error rates

## 🔒 Security Features

### Implemented
- JWT authentication framework
- RBAC with 3 roles and 35+ permissions
- PBAC geographic restriction (Costa Rica)
- Row-Level Security (PostgreSQL)
- AES-256 encryption support
- Rate limiting framework
- CORS configuration

### To Implement
- Password hashing (bcrypt)
- MFA support
- Session management
- API key management

## 📚 Additional Documentation

- `README.md` - Complete project documentation
- `PROJECT_STRUCTURE.md` - Detailed structure overview
- `migrations/README.md` - Database migration guide
- Individual file comments - Implementation notes

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Check connection
psql -U postgres -d dua_streamliner -c "SELECT 1"
```

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Module Not Found Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 💡 Best Practices

1. **Always use TypeScript** - Type safety prevents bugs
2. **Follow the patterns** - Strategy, Adapter, Builder, Singleton
3. **Test thoroughly** - Aim for 80%+ coverage
4. **Document as you go** - Update comments and README
5. **Use configuration** - Never hardcode values
6. **Log properly** - Use appropriate log levels
7. **Handle errors** - Always use try-catch in async functions
8. **Validate input** - Use Zod schemas
9. **Secure secrets** - Use environment variables
10. **Monitor everything** - Metrics, logs, health checks

## 🆘 Support

For questions or issues:
- Review inline TODO comments
- Check the comprehensive README.md
- Refer to design pattern documentation
- Review example implementations in strategies/adapters/builders

## 📄 License

Proprietary - Sebastian Sanchez Delgado, Valeria Vargas Alvarado

## 👥 Authors

- Sebastian Sanchez Delgado (2023346349)
- Valeria Vargas Alvarado (2023044728)

---

**Ready to build!** Start with Phase 1 and work through the checklist. Good luck! 🚀
