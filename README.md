# Caso 1 - DUA Streamliner

Sistema Inteligente para la Generación Automatizada del DUA
[El Problema]

The current process of preparing the DUA is highly manual, time-consuming, and error-prone for importers and exporters. Information required to complete the document is typically scattered across multiple files such as Excel sheets, Word documents, PDFs, and scanned invoices. These documents often follow different structures and formats, making data extraction complex and heavily dependent on human interpretation. As a result, customs specialists spend significant time consolidating, validating, and transcribing information into the official template.

To address this challenge, the proposed solution is an automated system that requires only a folder path containing all relevant documents. The system will intelligently read multiple formats, extract both structured and unstructured data—including OCR from scanned images—and apply AI-driven semantic interpretation tailored to customs terminology. It will then automatically map the extracted information to the official DUA template defined by the Ministerio de Hacienda, validate basic consistency rules, and flag ambiguous or low-confidence fields for review.

The expected result is a fully pre-filled Word DUA document with visual confidence indicators that guide expert validation. This approach does not eliminate the customs specialist's role but transforms it into a strategic review function, significantly reducing manual operational workload. Ultimately, the system aims to increase efficiency, reduce errors, accelerate processing times, and improve compliance accuracy in international trade operations.

Autores:
 - Sebastian Sanchez Delgado 2023346349
 - Valeria Vargas Alvarado 2023044728

## 1. Frontend Design
https://github.com/vsurak/cursostec/blob/master/diseno/Week%20%233%20-%20Dise%C3%B1o%20del%20frontend.md


### 1.1 Technology Stack
- Application Type: Web-app
- Language: TypeScript 5.4
- Framework: Next.js 13.5
	- React 18.3
	- React Dropzone 14.2 (File Upload)
- Component Library: shadcn/ui 0.8
- Styling: Tailwind CSS 3.4
	- Icons Lucide React 0.383
- Auth: Auth.js
- Notifications: Sonner 1.5
- State Management: Zustand 4.5 (UI State)
- Data Fetching: TanStack Query 5.40 (Databases)
- Data Validation: Zod 4
- Unit Testing: Jest 30.0
- Integration / E2E Testing: Playwright 1.58+
- Code Formatting: Prettier
- Code Linting: ESLint
- Observability: Sentry
- Code Repository & Collaboration: GitHub
- Automation & CI/CD: GitHub Actions (CI/CD Pipelines)
	- npm scripts (Task Automation)
- Hosting / Cloud: Vercel
- Deployment Tools: GitHub Actions

### 1.2 UX/UI Analysis

**Usability attributes:**

- **Minimal input friction:** Single folder path input or drag-and-drop file upload as primary entry point.
- **Progressive disclosure:** Show only relevant fields per step; hide complexity until needed.
- **Confidence visibility:** Color-coded field indicators (green / yellow / red) map directly to AI extraction confidence.
- **Inline validation:** Field-level error messages appear on blur, not on submit.
- **Expert-first review flow:** Flagged fields surface first in review mode; validated fields are collapsed by default.
- **Responsive layout:** Functional across desktop (1440px), laptop (1280px), and tablet (768px).

**Wireframes:**

```
┌─────────────────────────────────────────────────────┐
│  [Logo]          DUA Streamliner         [User Menu] │
├─────────────────────────────────────────────────────┤
│                                                     │
│   Step 1: Upload          Step 2: Review            │
│   ──────────────          ─────────────             │
│                                                     │
│   ┌─────────────────────────────────┐               │
│   │  Drop files here or browse      │               │
│   │  Supported: .xlsx .docx .pdf    │               │
│   │             .png .jpg           │               │
│   └─────────────────────────────────┘               │
│                                                     │
│   [Process Documents →]                             │
│                                                     │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│  DUA Review — Flagged Fields (3)   [Export Word]    │
├──────────────────┬──────────────────────────────────┤
│ Field            │ Extracted Value        Confidence│
├──────────────────┼──────────────────────────────────┤
│ Declarant NIT  🔴│ [____________]         Low       │
│ Origin Country 🟡│ [CN          ]         Medium    │
│ HS Code        🟢│ [8471.30.00  ]         High      │
│ Gross Weight   🟢│ [1,240 kg    ]         High      │
└──────────────────┴──────────────────────────────────┘
```

**UX validation:** Wireframes were tested with 3 customs specialists in think-aloud sessions. Key findings: (1) confidence color scale was intuitive without a legend, (2) users expected drag-and-drop before seeing the browse button—order was adjusted, (3) "Export Word" CTA placement in header was preferred over a bottom footer position.

### 1.3 Component Design Strategy

**Technique:** Atomic Design — atoms → molecules → organisms → pages.

**Reusability:** Components accept typed props with sensible defaults; variants are driven by props, not duplicated components. Shared logic extracted to custom hooks under `src/hooks/`.

**Style centralization:** Single Tailwind config at `tailwind.config.ts` defines the design token set (colors, spacing, radius, typography). `src/styles/globals.css` holds CSS variables consumed by shadcn/ui tokens.

**Branding:** Brand colors, fonts, and logo assets live in `src/styles/brand.ts` and are injected into the Tailwind theme. No hardcoded color values outside this file.

**i18n:** All user-facing strings referenced via `t('namespace.key')` from i18next. Translation files at `src/locales/{en,es}/`. Default locale: `es`. Locale persisted to `localStorage`.

**Responsiveness:** Mobile-first Tailwind breakpoints (`sm`, `md`, `lg`). Layout components use CSS Grid with `auto-fill` columns. No fixed pixel widths on containers.

### 1.4 Security

| Concern | Technology | Location |
|---|---|---|
| Authentication | Auth0 (PKCE flow) | `src/auth/AuthProvider.tsx` |
| Route protection | `RequireAuth` HOC | `src/auth/RequireAuth.tsx` |
| Token storage | Auth0 in-memory cache | Managed by SDK |
| Token injection | Axios request interceptor | `src/api/interceptors/authInterceptor.ts` |
| Session expiry | Auth0 silent refresh + logout redirect | `src/auth/useSessionGuard.ts` |
| Permission checks | `usePermissions` hook wrapping Auth0 claims | `src/auth/usePermissions.ts` |
| CSRF | SameSite=Strict cookies on BFF (if applicable) | Backend concern |
| Input sanitization | Zod schema validation at form submit | `src/schemas/` |

### 1.5 Layered Design

```
┌──────────────────────────────────────────┐
│              Pages Layer                 │  src/pages/
│   Route-level components, no logic       │
├──────────────────────────────────────────┤
│            Feature Layer                 │  src/features/
│   Domain-specific organisms and hooks    │
├──────────────────────────────────────────┤
│           Component Layer                │  src/components/
│   Reusable UI atoms and molecules        │
├──────────────────────────────────────────┤
│            Service Layer                 │  src/services/
│   API calls, data transformation         │
├──────────────────────────────────────────┤
│             Store Layer                  │  src/store/
│   Zustand slices, global client state    │
├──────────────────────────────────────────┤
│              Auth Layer                  │  src/auth/
│   Auth0 provider, guards, session hooks  │
└──────────────────────────────────────────┘
```
### 1.6 Design Patterns

| Pattern | Class / Hook | Location |
|---|---|---|
| Singleton | `ApiClient` (Axios instance) | `src/services/ApiClient.ts` |
| Factory | `DocumentParserFactory` | `src/services/parsers/DocumentParserFactory.ts` |
| Observer | `useNotifications` (Sonner + event bus) | `src/hooks/useNotifications.ts` |
| Strategy | `ConfidenceStrategy` (per-field rules) | `src/features/dua/strategies/ConfidenceStrategy.ts` |
| Repository | `DuaRepository` (TanStack Query wrappers) | `src/services/repositories/DuaRepository.ts` |
| Command | `useFileUploadCommand` (async file pipeline) | `src/hooks/useFileUploadCommand.ts` |
| Facade | `DuaService` (orchestrates parsers + API) | `src/services/DuaService.ts` |
| Guard / HOC | `RequireAuth`, `RequirePermission` | `src/auth/RequireAuth.tsx`, `src/auth/RequirePermission.tsx` |
| Slice (Flux) | `duaSlice`, `uploadSlice` | `src/store/duaSlice.ts`, `src/store/uploadSlice.ts` |

### 1.7 Project Scaffold

```
src/
├── auth/
│   ├── AuthProvider.tsx
│   ├── RequireAuth.tsx
│   ├── RequirePermission.tsx
│   ├── usePermissions.ts
│   └── useSessionGuard.ts
├── components/
│   ├── ui/                        # shadcn/ui base components
│   ├── ConfidenceBadge.tsx
│   ├── DropZone.tsx
│   ├── FieldRow.tsx
│   └── StepIndicator.tsx
├── features/
│   └── dua/
│       ├── DuaReviewTable.tsx
│       ├── DuaUploadPanel.tsx
│       ├── hooks/
│       │   ├── useDuaReview.ts
│       │   └── useDuaSubmit.ts
│       └── strategies/
│           └── ConfidenceStrategy.ts
├── hooks/
│   ├── useFileUploadCommand.ts
│   └── useNotifications.ts
├── locales/
│   ├── en/
│   │   └── common.json
│   └── es/
│       └── common.json
├── pages/
│   ├── HomePage.tsx
│   ├── ReviewPage.tsx
│   └── NotFoundPage.tsx
├── schemas/
│   ├── duaSchema.ts
│   └── uploadSchema.ts
├── services/
│   ├── ApiClient.ts
│   ├── DuaService.ts
│   ├── parsers/
│   │   └── DocumentParserFactory.ts
│   └── repositories/
│       └── DuaRepository.ts
├── store/
│   ├── duaSlice.ts
│   └── uploadSlice.ts
├── styles/
│   ├── brand.ts
│   └── globals.css
├── App.tsx
├── main.tsx
└── router.tsx
```

### Technology Stack

## 2. Backend

## 3. Databases

## Recursos
- Qué es DUA: https://alianza-logistics.com/documento-unico-aduanero-2/
- Especificacion de Hacienda: https://www.hacienda.go.cr/docs/Mensaje_TD_DUA.pdf
- Como llenar el DUA: https://gestionesenlinea.es/formulario-dua-documento-unico-administrativo/
