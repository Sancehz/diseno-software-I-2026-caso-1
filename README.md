# Caso 1 - DUA Streamliner

## Intelligent system for DUA streamlining

The current process of preparing the DUA is highly manual, time-consuming, and error-prone for importers and exporters. Information required to complete the document is typically scattered across multiple files such as Excel sheets, Word documents, PDFs, and scanned invoices. These documents often follow different structures and formats, making data extraction complex and heavily dependent on human interpretation. As a result, customs specialists spend significant time consolidating, validating, and transcribing information into the official template.

To address this challenge, the proposed solution is an automated system that requires only a folder path containing all relevant documents. The system will intelligently read multiple formats, extract both structured and unstructured data—including OCR from scanned images—and apply AI-driven semantic interpretation tailored to customs terminology. It will then automatically map the extracted information to the official DUA template defined by the Ministerio de Hacienda, validate basic consistency rules, and flag ambiguous or low-confidence fields for review.

The expected result is a fully pre-filled Word DUA document with visual confidence indicators that guide expert validation. This approach does not eliminate the customs specialist's role but transforms it into a strategic review function, significantly reducing manual operational workload. Ultimately, the system aims to increase efficiency, reduce errors, accelerate processing times, and improve compliance accuracy in international trade operations.

Authors:
 - Sebastian Sanchez Delgado 2023346349
 - Valeria Vargas Alvarado 2023044728

## 1. Frontend Design

### 1.1 Technology Stacks
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

#### Core business process
##### Login
- User enters their credentials (username/email, password)
- If the user exists but the password is incorrect, the user is prompted to enter the correct password
- If the user does not exist, they are informed their username/email is incorrect

##### Streamliner Configuration
- User selects a folder containing word and excel files from their computer
- User selects a single Word file as the template for the DUA report
- User confirms the files to be scanned from the folder

##### Process monitoring
- For each stage of the process, the user is informed of the state of the report: Scanning the template, scanning each file and generating the report
- If there is an error during the process, the user is prompted to configure the streamliner again

##### Results
- If the proces is successful, the user is shown a small preview of the file
- The user downloads the final report

##### Logout
- The user can choose to log out if there is no report in progress, they are asked for confirmation
- If the user confirms the logout, they are brought back to the login page

#### Wireframes
##### Login
![login](/img/wireframe_login.webp)

##### Streamliner Configuration
![setting](/img/wireframe_setting_1.webp)
![setting](/img/wireframe_setting_2.webp)

##### Process monitoring
![monitor](/img/wireframe_monitor_1.webp)
![monitor](/img/wireframe_monitor_2.webp)

##### Results
![result](/img/wireframe_report.webp)

##### Logout
![logout](/img/wireframe_logout_1.webp)
![logout](/img/wireframe_logout_2.webp)


#### UX test results (homework)
- Tools:
    - Wirframes: Figma
	- UX testing: Useberry

##### Results
- Participants: 8
- Pool: TEC Students

| Time   | Device  | Completed | Rating | Comments |
| :----: | :-----: | :-------: | :----: | :------- |
| 3m 42s | Desktop | Yes       | 5/5    | me gusta la simplicidad de la pagina, muy facil de entender |
|    29s | Mobile  |  No       | N/A    | N/A     |
| 1m 50s | Desktop | Yes       | 5/5    | Interfaz muy elegante  |
| 4m 31s | Desktop | Yes       | 5/5    | N/A     |
|    37s | Mobile  |  No       | N/A    | N/A     |
| 2m     | Desktop | Yes       | 5/5    | N/A     |
| 1m 46s | Mobile  | Yes       | 5/5    | N/A     |
| 4m 47s | Desktop | Yes       | 5/5    | Buen layout, fácil de usar. |

Results visible at: https://app.useberry.com/sharing-results/QPLIjHIrjaB066/?segmentID=30022375-da37-46d1-a394-a7ec64bf5498

##### Heatmaps
Login:
![HMlogin](/img/1.HMLogin.png)

Streamliner config:
![HMSteamliner](/img/2.HMStreamlinerConfig.png)

Process monitoring:
![HMProcessMonitoring](/img/3.HMProcessMonitoring.png)

Results:
![HMResults](/img/4.HMResults.png)

Logout:
![HMLogout](/img/5.HMLogout.png)

### 1.3 Component Design Strategy
Strategy: Utility first
Reutilization by: Tailwind, shadcn/ui 
Internationalization by: Next.js native routing support (i18n)
Responsiveness by: Tailwind breakpoints, React

### 1.4 Security

![SecAuthArchitecture](/img/1.4.security_auth_architecture.svg)

Tecnologías, técnicas y classes con su respectiva ubicación en la estructura del proyecto responsables de la autenticación y la autorización de permisos y sesiones.

Tomando en cuenta donde se hostea (Vercel / Cloud)
- Es un single app auth? Si
- Que servicios de auth hay? (Authenticator y Credential server)
- Cual va a ser el hosting? 
- Preguntar si vercel tiene un servicio de sesiones nativo o cache de sesiones (Redis, memcached)
    - Cual servicio de sesiones?
- Auth server name? 

La seguridad del sistema se basa en roles (RBAC)
Tipos de usuario:
- Admin: Maneja y observa los procesos actuales de reportes, etc.
- Soporte tecnico: Esta disponible a preguntas de usuarios.
- Usuario aduanero: Genera reportes.

** TODO: Add lista de permisos por rol (CODIGO, DESCRIPCION)

Se tiene un acceso basado en politicaas (PBAC): La aplicacion solo se puede acceder desde Costa Rica.

MFA: Multifactor Auth
- Como se autentican los usuarios del app?
- La app soporta MFA? metodo: authenticator app, etc.
- Server de credenciales?

**OPCION ALTERNATIVA: Si el app se autentica exclusivamente con google, facebook, etc.** (preferible porque es mas facil)

Cual es el servicio de secured storage para variables de entorno, sensitive data, etc.

#### Instrucciones
Tecnologías, técnicas y classes con su respectiva ubicación en la estructura del proyecto responsables de la autenticación y la autorización de permisos y sesiones. 

- Si es MFA
- Qué medios de MFA soporta
- Si es single sign on o no
- Service de authentication , depende de la plataforma
- Definir si soporta google and or facebook authentication (Utiliza google auth)
- Si es RBAC, dar la lista de roles: rolename, description
- Para cada role, lista de permisos: codigo de permiso, descripcion (Estan arriba)
- Si tiene algun tipo de ACL y el nombre del servicio de ACL (no???????)
- Si tiene PBAC, definir las políticas (solo usuario con IP en CR)
- Servicio de secure store para env variables, api keys, sensitive data
- authenticator server name

### 1.5 Layered Design

![LayeredArchitecture](/img/1.5.layered_architecture_overview.svg)

Domininios de responsabilidad de los objetos

Parte de component Design

Hooks (react)

1. dame the folder structure for a common [el framework o metodo de componentizacion que ustedes eligieron] in [technologia de frontend seleccionada] required to build webapps

2. List of tipical responsibility layers in a enterprise frontend design, provide just the list of names
- Business logic
- State management 
- Data access
- API layers / third party services
- Utils
- Data validation (input - output)
- Authentication layer
- Authorization layer
- Models 
- Testability - Capa no activa
- Observability (logs)
- Settings (envvars)
- Routing (cuando haya que conectarse de muchas fuentes)
- Listeners
- Section handling

#### Arquitectura top down (copiado del prof)
Las layers adjacentes en profundidad y en layer se utilizan entre si
El frontend utiliza Server Side Rendering
- Models (objects), utils y state management es accedido por todas las layers

- Si no hay una sesion autenticada, se lleva al layer de Authentication
- Si la autenticacion es exitosa: 
	- Notification layer se relaciona con todas las layers siguientes
    - Se accede del recurso visual de la capa de components (views): Los componentes siguen Utility first design
        - En la capa de services (business logic) podrian requerir de acceder:
        - Utils para data validation y fetch del usuario (archivo)
	    - Settings
	        - API layer
           
Layered design overviews:

SSR layer — Next.js runtime
Every incoming request enters here. Server components and route handlers execute on Vercel's serverless infrastructure. Before any rendering occurs, the edge middleware (middleware.ts) enforces the PBAC geo-restriction and delegates authentication checks to Auth.js. This layer is also responsible for hydration: it pre-renders the initial HTML and passes it to the browser.
src/
├── app/                    ← Next.js App Router (server components by default)
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/                ← Route handlers
└── middleware.ts            ← Edge middleware (PBAC + session guard)

Authentication layer
If no valid session exists when the SSR layer processes a request, the user is redirected to the authentication flow. This layer is not a UI concern — it is resolved entirely at the server level by Auth.js before the Components Layer ever renders. On success, a JWT session is established and the request continues to the Components Layer.
src/
└── auth/
    ├── auth.config.ts       ← Entra ID provider, JWT/session callbacks
    └── auth.ts              ← Auth.js instance export

Components layer
Activated only after a valid authenticated session is confirmed. Components follow Atomic Design, organized from the smallest reusable primitives up to full page compositions. Styling uses Tailwind CSS (utility-first), and the component library is shadcn/ui.
src/
└── components/
    ├── atoms/               ← Button, Input, Badge, Icon, Spinner
    ├── molecules/           ← FileDropzone, StatusBadge, ConfidenceBar
    ├── organisms/           ← FileSelector, ProcessMonitor, ResultsPanel
    ├── templates/           ← PageLayout, DashboardShell
    └── pages/               ← LoginPage, StreamlinerPage, ResultsPage
No business logic lives in components. Components are responsible only for rendering and forwarding user interactions to the Hooks Layer.

Hooks layer
React custom hooks sit between components and services. They translate UI events (button clicks, file selections, form submissions) into service calls, and they feed data from the Services Layer back into component state. Hooks use TanStack Query for async server-state management and Zustand for local UI state.
src/
└── hooks/
    ├── useAuth.ts           ← Session reads, role/permission checks
    ├── useFileUpload.ts     ← Manages file selection and validation
    ├── useDuaGeneration.ts  ← Triggers and monitors the AI generation process
    ├── useDownload.ts       ← Handles DUA document download
    └── useNotifications.ts  ← Subscribes to Notification Service events
Hooks never call ApiClients directly. They call Services, which decide whether an API call is needed.

Services layer
The business logic home. Services are plain TypeScript classes instantiated once per request context. They orchestrate operations: deciding when to call an API, when to read from state, when to validate data, and when to emit a notification. Services have no knowledge of React or the DOM.
src/
└── services/
    ├── AuthService.ts       ← Session resolution, permission validation
    ├── FileService.ts       ← File reading, format detection, pre-processing
    ├── DuaService.ts        ← AI generation orchestration, template mapping
    ├── TemplateService.ts   ← DUA template CRUD (Manager role only)
    ├── UserService.ts       ← User management (Manager role only)
    ├── ReportService.ts     ← Operational report generation
    └── DownloadService.ts   ← Document export and download packaging

Utils layer
Stateless helper functions with no side effects. Reachable from any layer. Includes formatters, date helpers, file-type utilities, string sanitizers, and type guards.
src/
└── utils/
    ├── formatters.ts
    ├── fileUtils.ts
    ├── typeGuards.ts
    └── dateUtils.ts

ApiClients layer
All classes that communicate with external APIs live here and nowhere else. Each client is focused on a single external service. Clients read their base URLs and API keys from Settings. All request payloads and response objects pass through Models and are validated by the DataValidation layer before being used by services. Async calls always emit results through the NotificationService rather than returning directly.
src/
└── api/
    ├── AzureOpenAIClient.ts  ← AI generation and OCR endpoints
    ├── KeyVaultClient.ts     ← Secret resolution at startup
    ├── StorageClient.ts      ← File storage operations
    └── InsightsClient.ts     ← Azure Application Insights telemetry

Settings layer
Reads environment variables injected by the Vercel runtime, which are sourced from Azure Key Vault. Settings is a read-only singleton. ApiClients reads from it at initialization; no other layer reaches Key Vault directly.
src/
└── config/
    └── settings.ts          ← Typed env var accessors (process.env wrappers)


### 1.6 Design Patterns


### 1.7 Scaffold
- Visible en `/src`

## Recursos
- Qué es DUA: https://alianza-logistics.com/documento-unico-aduanero-2/
- Especificacion de Hacienda: https://www.hacienda.go.cr/docs/Mensaje_TD_DUA.pdf
- Como llenar el DUA: https://gestionesenlinea.es/formulario-dua-documento-unico-administrativo/
