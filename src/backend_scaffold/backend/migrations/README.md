# Database Migrations

This directory contains PostgreSQL database migration scripts.

## Migration Naming Convention

Migrations should be named with timestamp and description:
```
YYYYMMDDHHMMSS_description.sql
```

Example:
```
20240101120000_create_users_table.sql
20240101130000_create_files_table.sql
20240101140000_create_reports_table.sql
```

## Migration Structure

Each migration file should contain:
- Forward migration (CREATE, ALTER, etc.)
- Rollback migration (DROP, etc.) in comments

## Example Migration Files

### 001_create_users_table.sql
```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  mfa_enabled BOOLEAN DEFAULT false,
  mfa_secret VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Enable Row-Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Rollback:
-- DROP TABLE IF EXISTS users CASCADE;
```

### 002_create_files_table.sql
```sql
-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size BIGINT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP,
  status VARCHAR(50) DEFAULT 'PENDING',
  confidence DECIMAL(5,4),
  error_message TEXT,
  metadata JSONB
);

CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_status ON files(status);
CREATE INDEX idx_files_uploaded_at ON files(uploaded_at);

ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Rollback:
-- DROP TABLE IF EXISTS files CASCADE;
```

### 003_create_reports_table.sql
```sql
-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID,
  report_data JSONB NOT NULL,
  overall_confidence DECIMAL(5,4),
  validation_status VARCHAR(50) DEFAULT 'draft',
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  downloaded_at TIMESTAMP,
  metadata JSONB
);

CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_generated_at ON reports(generated_at);
CREATE INDEX idx_reports_validation_status ON reports(validation_status);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Rollback:
-- DROP TABLE IF EXISTS reports CASCADE;
```

## Running Migrations

Use the migration script:
```bash
npm run migrate
```

Or manually with psql:
```bash
psql -U postgres -d dua_streamliner -f migrations/001_create_users_table.sql
```
