import { NotificationService } from "@/notifications/NotificationService";
import { ExternalServiceError } from "@/exceptions/AppError";
import { logger } from "@/logging/logger";

/**
 * StorageClient — file storage operations (Azure Blob Storage).
 * Design pattern: Singleton
 */
class _StorageClient {
  async uploadFile(file: File, path: string): Promise<string> {
    try {
      // Azure Blob Storage upload — returns blob URL
      logger.info("StorageClient.uploadFile", { path });
      // TODO: implement using @azure/storage-blob SDK
      const url = `https://placeholder.blob.core.windows.net/${path}`;
      return url;
    } catch (error) {
      logger.error(error as Error, { context: "StorageClient.uploadFile" });
      throw new ExternalServiceError("AzureStorage", String(error));
    }
  }

  async downloadFile(blobUrl: string): Promise<Blob> {
    const response = await fetch(blobUrl);
    if (!response.ok) throw new ExternalServiceError("AzureStorage", `HTTP ${response.status}`);
    return response.blob();
  }
}

export const StorageClient = new _StorageClient();
