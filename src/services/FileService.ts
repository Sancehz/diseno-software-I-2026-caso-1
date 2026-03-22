import { getFileType } from "@/utils/fileUtils";
import { FileUploadSchema } from "@/validation";
import { StorageClient } from "@/api/StorageClient";
import { NotificationService } from "@/notifications/NotificationService";
import { ValidationError } from "@/exceptions/AppError";
import { logger } from "@/logging/logger";
import type { SourceFile } from "@/models";
import { v4 as uuid } from "uuid";

/**
 * FileService — file reading, format detection, pre-processing.
 * Permission required: LOAD_FILES
 */
export class FileService {
  async processUploadedFiles(files: File[]): Promise<SourceFile[]> {
    const sourceFiles: SourceFile[] = [];

    for (const file of files) {
      const parsed = FileUploadSchema.safeParse({ name: file.name, size: file.size });
      if (!parsed.success) {
        throw new ValidationError(`Invalid file "${file.name}": ${parsed.error.message}`);
      }

      NotificationService.publish({
        type: "PROCESS_EVENT",
        data: { type: "SCAN_FILE_START", message: `Scanning ${file.name}`, timestamp: new Date() },
      });

      const uploadPath = `uploads/${uuid()}/${file.name}`;
      await StorageClient.uploadFile(file, uploadPath);

      sourceFiles.push({
        id: uuid(),
        name: file.name,
        type: getFileType(file.name),
        sizeBytes: file.size,
        relativePath: uploadPath,
      });

      NotificationService.publish({
        type: "PROCESS_EVENT",
        data: { type: "SCAN_FILE_COMPLETE", message: `Scanned ${file.name}`, timestamp: new Date() },
      });
    }

    logger.info("FileService: processed files", { count: files.length });
    return sourceFiles;
  }
}
