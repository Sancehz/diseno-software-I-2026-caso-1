# DUA Streamliner

Intelligent system for automating the preparation of the **Documento Único Aduanero (DUA)** required by the Ministerio de Hacienda of Costa Rica.

The system reads a folder of source documents (Word, Excel, PDF, scanned images), extracts structured and unstructured data using AI and OCR, maps the results to the official DUA template, and produces a pre-filled `.docx` file with visual confidence indicators for expert review.

> **Authors:** Sebastian Sanchez Delgado · Valeria Vargas Alvarado  
> **Course:** TEC — Software Engineering

---

## Table of contents

1. [Prerequisites](#prerequisites)
2. [Tech stack](#tech-stack)
3. [Project structure](#project-structure)
4. [Local development setup](#local-development-setup)
5. [Environment variables](#environment-variables)
6. [Running the app](#running-the-app)
7. [Testing](#testing)
8. [Code quality](#code-quality)
9. [Building for production](#building-for-production)
10. [Deployment (Vercel)](#deployment-vercel)
11. [Architecture overview](#architecture-overview)
12. [Roles and permissions](#roles-and-permissions)
13. [CI/CD pipeline](#cicd-pipeline)

---

## Prerequisites

| Tool | Minimum version | Notes |
|---|---|---|
| Node.js | 20.x LTS | Required by Next.js 13.5 |
| npm | 10.x | Bundled with Node 20 |
| Git | 2.x | |
| Azure account | — | Entra ID tenant, Key Vault, OpenAI, Storage |

> **Do not use Yarn or pnpm.** The project is locked to npm scripts for task automation.

---

## Tech stack

| Category | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, SSR) | 13.5 |
| Language | TypeScript | 5.4 |
| UI library | shadcn/ui | 0.8 |
| Styling | Tailwind CSS | 3.4 |
| Auth | Auth.js v5 + Azure Entra ID | ^5.0.0-beta |
| State | Zustand | 4.5 |
| Data fetching | TanStack Query | 5.40 |
| Validation | Zod | 4 |
| File upload | React Dropzone | 14.2 |
| Notifications | Sonner | 1.5 |
| Observability | Sentry | ^8 |
| Unit testing | Jest | 30 |
| E2E testing | Playwright | 1.58 |
| Hosting | Vercel | — |
| Secrets | Azure Key Vault | — |

---

## Project structure

```
src/
├── app/                        # Next.js App Router
│   ├── (auth)/login/           # Public login page
│   ├── (dashboard)/            # Authenticated routes
│   │   ├── streamliner/        # File upload + generation trigger
│   │   ├── results/            # Generated DUA preview + download
│   │   ├── reports/            # Operational reports (Manager)
│   │   ├── users/              # User management (Manager)
│   │   └── templates/          # DUA template management (Manager)
│   └── api/                    # Route handlers
│       ├── auth/[...nextauth]/  # Auth.js catch-all
│       ├── dua/generate/        # POST — trigger AI generation
│       ├── dua/download/[id]/   # GET  — download generated DUA
│       ├── files/upload/        # POST — upload source files
│       ├── users/               # CRUD — user management
│       ├── templates/           # CRUD — DUA templates
│       └── reports/             # GET  — operational reports
├── auth/                       # Auth.js configuration (Entra ID)
├── components/                 # Atomic Design UI
│   ├── atoms/                  # Button, Badge, Spinner, ConfidenceIndicator
│   ├── molecules/              # FileDropzone, ProcessEventItem, DuaFieldRow
│   ├── organisms/              # FileSelector, ProcessMonitor, ResultsPanel
│   ├── templates/              # PageLayout, DashboardShell
│   ├── pages/                  # LoginPage, StreamlinerPage, ResultsPage
│   └── auth/                   # PermissionGate
├── hooks/                      # React custom hooks
├── services/                   # Business logic classes
├── api/                        # ApiClient classes (external services)
├── config/                     # Settings — typed env var accessors
├── models/                     # TypeScript interfaces/types
├── validation/                 # Zod schemas (input & output)
├── store/                      # Zustand stores
├── notifications/              # NotificationService (pub/sub)
├── exceptions/                 # Typed error classes
├── logging/                    # Logger (Sentry wrapper)
├── lib/                        # Permissions helper, auth utilities
├── middleware.ts               # Edge middleware: PBAC geo-check + auth guard
└── __tests__/
    ├── unit/                   # Jest unit tests
    └── e2e/                    # Playwright end-to-end tests
```

---

## Local development setup

### 1 — Clone the repository

```bash
git clone https://github.com/<your-org>/dua-streamliner.git
cd dua-streamliner
```

### 2 — Install dependencies

```bash
npm install
```

### 3 — Install shadcn/ui components

The project uses shadcn/ui. After installing dependencies, initialise and add the required components:

```bash
npx shadcn-ui@0.8.0 init
npx shadcn-ui@0.8.0 add button badge
```

When prompted, choose:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

### 4 — Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local` — see [Environment variables](#environment-variables) below for what each value means and where to find it.

### 5 — Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/login` if you are not authenticated.

---

## Environment variables

All secrets are sourced from **Azure Key Vault** in production. For local development, place them in `.env.local` (never commit this file).

```bash
# ── Azure Entra ID (customsidentityserver) ──────────────────────────────
# Found in: Azure Portal → Entra ID → App Registrations → your app
AZURE_AD_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# ── Auth.js ──────────────────────────────────────────────────────────────
# Generate a secure random value:
#   openssl rand -base64 32
AUTH_SECRET=your-random-secret-here

# ── Azure OpenAI ─────────────────────────────────────────────────────────
# Found in: Azure Portal → Azure OpenAI → Keys and Endpoint
AZURE_OPENAI_API_KEY=your-openai-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com

# ── Azure Blob Storage ───────────────────────────────────────────────────
# Found in: Azure Portal → Storage Accounts → Access Keys
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...

# ── Sentry ───────────────────────────────────────────────────────────────
# Found in: sentry.io → Settings → Projects → Client Keys
SENTRY_DSN=https://xxxx@oxxxx.ingest.sentry.io/xxxx

# ── App ──────────────────────────────────────────────────────────────────
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

> **Security note:** `.env.local` is git-ignored by Next.js by default. Never add secrets to `.env` or commit them to version control.

---

## Running the app

### Development (hot reload)

```bash
npm run dev
```

### Production build preview

```bash
npm run build
npm run start
```

### Available npm scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload on port 3000 |
| `npm run build` | Compile and optimise for production |
| `npm run start` | Serve the production build locally |
| `npm run lint` | Run ESLint across all `.ts` and `.tsx` files |
| `npm run format` | Run Prettier and rewrite files in place |
| `npm test` | Run Jest unit test suite |
| `npm run test:coverage` | Run Jest with coverage report |
| `npm run test:e2e` | Run Playwright end-to-end tests |

---

## Testing

### Unit tests (Jest)

Tests live in `src/__tests__/unit/`. They cover permissions, validation schemas, and utility functions — no external services required.

```bash
npm test
```

To watch for changes during development:

```bash
npx jest --watch
```

To generate a coverage report:

```bash
npm run test:coverage
```

### End-to-end tests (Playwright)

E2E specs live in `src/__tests__/e2e/`. They require a running application.

**First-time setup — install browsers:**

```bash
npx playwright install --with-deps
```

**Run against the local dev server:**

```bash
# Terminal 1
npm run dev

# Terminal 2
npm run test:e2e
```

**Run against a specific browser:**

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**Authenticated E2E tests:**

Some specs require an authenticated session. Generate a stored auth state:

```bash
npx playwright test --global-setup ./playwright.global-setup.ts
```

> The `storageState` file (`playwright/.auth/user.json`) is git-ignored.

---

## Code quality

### Linting

```bash
npm run lint
```

ESLint is configured with `eslint-config-next`. Fix auto-fixable issues:

```bash
npx eslint . --ext .ts,.tsx --fix
```

### Formatting

```bash
npm run format
```

Prettier is configured for TypeScript, TSX, JSON, and CSS. To check without writing:

```bash
npx prettier --check .
```

### Pre-commit hooks (recommended)

Install `lint-staged` + `husky` to enforce quality on every commit:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

Then add to `package.json`:

```json
"lint-staged": {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
  "*.{json,css,md}": ["prettier --write"]
}
```

---

## Building for production

```bash
npm run build
```

Next.js outputs the optimised build to `.next/`. Review the build output for any size warnings before deploying.

To serve the production build locally before deploying:

```bash
npm run start
```

---

## Deployment (Vercel)

The project is deployed automatically via **GitHub Actions → Vercel**.

### Manual deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Automatic deploy via GitHub Actions

The CI/CD pipeline triggers on every push to `main`. See `.github/workflows/` for pipeline configuration.

**Pipeline stages:**

```
Push to GitHub
    │
    ▼
GitHub Actions
    ├── Lint (ESLint)
    ├── Type-check (tsc --noEmit)
    ├── Unit tests (Jest)
    └── Deploy to Vercel
            ├── Branch push   → Preview environment
            └── main merge    → Production environment
```

### Vercel environment variables

In the Vercel dashboard (**Settings → Environment Variables**), add all variables from `.env.example`. In production, these are sourced from Azure Key Vault via the Vercel integration.

To link Azure Key Vault to Vercel:
1. Azure Portal → Key Vault → Access Policies → add Vercel's managed identity
2. Vercel Dashboard → Integrations → Azure Key Vault → connect

### PBAC — geographic access restriction

The `middleware.ts` edge function rejects all requests whose `x-vercel-ip-country` header is not `CR` (Costa Rica). This is enforced at the Vercel edge before any route handler runs. No additional configuration is needed — Vercel sets this header automatically on all incoming requests.

---

## Architecture overview

```
Browser
  │
  ▼  HTTPS
Next.js on Vercel (SSR)
  │
  ├─[no session]──► Authentication layer (Auth.js → Azure Entra ID → MFA)
  │
  └─[authenticated]
        │
        ▼
   Components layer  (Atomic Design: atoms → molecules → organisms → templates → pages)
        │
        ▼
   Hooks layer       (useAuth, useFileUpload, useDuaGeneration, useDownload, useNotifications)
        │
        ▼
   Services layer    (DuaService, FileService, AuthService, DownloadService, …)
        │
   ┌────┼────────────────┐
   ▼    ▼                ▼
 Utils  ApiClients    Settings
        │                │
        ▼                ▼
  External APIs     Azure Key Vault
  (Azure OpenAI,
   Blob Storage)

Shared (accessible from all layers):
  Models · Zod Validation · Zustand State · NotificationService · Exceptions · Logs
```

All asynchronous API calls resolve by publishing to `NotificationService` (Observer pattern) rather than returning promises directly. Hooks subscribe to the service to update UI state.

---

## Roles and permissions

Authentication is handled by **Azure Entra ID** (`customsidentityserver`) with **SSO** and **MFA** enforced via a mobile authenticator app. Role claims are embedded in the JWT and read by Auth.js.

| Role | Permission code | Description |
|---|---|---|
| Manager | `MANAGE_USERS` | Create, read, update, delete user accounts |
| Manager | `VIEW_REPORTS` | Access operational and performance reports |
| Manager | `EDIT_TEMPLATES` | Modify or replace available DUA Word templates |
| Customs Agent | `LOAD_FILES` | Configure and upload a folder of source documents |
| Customs Agent | `GENERATE_DUA` | Trigger the AI-driven DUA generation process |
| Customs Agent | `DOWNLOAD_DUA` | Download the completed DUA `.docx` file |

Permission checks run in two places:
- **Server-side:** `requirePermission()` in `src/lib/auth-utils.ts` — used in every API route handler and Server Action.
- **Client-side:** `<PermissionGate permission="...">` in `src/components/auth/PermissionGate.tsx` — used to conditionally render UI elements.

---

## CI/CD pipeline

Defined in `.github/workflows/`. The pipeline runs on every push and pull request.

```yaml
# Trigger: push to any branch, pull request to main
jobs:
  quality:
    - Lint (ESLint)
    - Type check (tsc --noEmit)
    - Unit tests (Jest)

  deploy-preview:
    needs: quality
    if: branch != main
    - Deploy to Vercel preview URL

  deploy-production:
    needs: quality
    if: branch == main
    - Deploy to Vercel production
```

Required GitHub Actions secrets (set in **Settings → Secrets and variables → Actions**):

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel personal access token |
| `VERCEL_ORG_ID` | Vercel organisation ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

All application secrets (`AZURE_AD_CLIENT_ID`, etc.) are managed in Vercel's environment variables dashboard and do **not** need to be added to GitHub secrets.

---

## References

- [What is a DUA](https://alianza-logistics.com/documento-unico-aduanero-2/)
- [Ministerio de Hacienda — DUA specification](https://www.hacienda.go.cr/docs/Mensaje_TD_DUA.pdf)
- [How to fill a DUA](https://gestionesenlinea.es/formulario-dua-documento-unico-administrativo/)
- [Next.js 13 App Router docs](https://nextjs.org/docs)
- [Auth.js v5 docs](https://authjs.dev)
- [Azure Entra ID — app registration](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app)