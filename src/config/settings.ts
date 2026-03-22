/**
 * Settings layer — typed read-only accessors for environment variables.
 *
 * All secrets are injected by the Vercel runtime from Azure Key Vault bindings.
 * No other layer reads process.env directly; all access goes through this file.
 *
 * Azure Key Vault stores:
 *   - Azure Entra ID credentials    (AZURE_AD_CLIENT_ID, AZURE_AD_CLIENT_SECRET, AZURE_AD_TENANT_ID)
 *   - Auth.js secret                (AUTH_SECRET)
 *   - Azure OpenAI API key          (AZURE_OPENAI_API_KEY)
 *   - Azure OpenAI endpoint         (AZURE_OPENAI_ENDPOINT)
 *   - Azure Storage connection str  (AZURE_STORAGE_CONNECTION_STRING)
 *   - Sentry DSN                    (SENTRY_DSN)
 */
function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const settings = {
  azure: {
    clientId: required("AZURE_AD_CLIENT_ID"),
    clientSecret: required("AZURE_AD_CLIENT_SECRET"),
    tenantId: required("AZURE_AD_TENANT_ID"),
    openAiApiKey: required("AZURE_OPENAI_API_KEY"),
    openAiEndpoint: required("AZURE_OPENAI_ENDPOINT"),
    storageConnectionString: required("AZURE_STORAGE_CONNECTION_STRING"),
  },
  auth: {
    secret: required("AUTH_SECRET"),
  },
  sentry: {
    dsn: required("SENTRY_DSN"),
  },
  app: {
    env: process.env.NODE_ENV ?? "development",
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  },
} as const;
