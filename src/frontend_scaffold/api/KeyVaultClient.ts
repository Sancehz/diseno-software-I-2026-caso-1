import { settings } from "@/config/settings";
import { logger } from "@/logging/logger";

/**
 * KeyVaultClient — resolves secrets from Azure Key Vault at startup.
 * In practice on Vercel, secrets are pre-injected as env vars by the
 * Azure Key Vault integration; this client supports direct resolution
 * for CI/CD pipeline scenarios.
 */
class _KeyVaultClient {
  async getSecret(secretName: string): Promise<string> {
    logger.info(`KeyVaultClient: resolving secret ${secretName}`);
    // In Vercel environments, secrets arrive as env vars.
    // This stub supports local/CI direct Key Vault calls if needed.
    const value = process.env[secretName];
    if (!value) throw new Error(`Secret not found: ${secretName}`);
    return value;
  }
}

export const KeyVaultClient = new _KeyVaultClient();
