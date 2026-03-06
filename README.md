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
!(img/wireframe_login.webp)

##### Streamliner Configuration

##### Process monitoring

##### Results

##### Logout


#### UX test results (homework)
- Escoger alguna app para ejecutar el UX test usando los wireframes
- Se aplica de forma remota compartido a 3 estudiantes o amigos
- Generar reporte de resultados en tabla de md (evidencias)
- Heatmap


## Recursos
- Qué es DUA: https://alianza-logistics.com/documento-unico-aduanero-2/
- Especificacion de Hacienda: https://www.hacienda.go.cr/docs/Mensaje_TD_DUA.pdf
- Como llenar el DUA: https://gestionesenlinea.es/formulario-dua-documento-unico-administrativo/
