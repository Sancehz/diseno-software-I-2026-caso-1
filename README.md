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

### 1.5 Layered Design

### 1.6 Design Patterns

## Recursos
- Qué es DUA: https://alianza-logistics.com/documento-unico-aduanero-2/
- Especificacion de Hacienda: https://www.hacienda.go.cr/docs/Mensaje_TD_DUA.pdf
- Como llenar el DUA: https://gestionesenlinea.es/formulario-dua-documento-unico-administrativo/
