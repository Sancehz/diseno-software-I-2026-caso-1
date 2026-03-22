import { StorageClient } from "@/api/StorageClient";
import { NotFoundError } from "@/exceptions/AppError";
import type { DuaDocument } from "@/models";

/**
 * DownloadService — document export and download packaging.
 * Permission required: DOWNLOAD_DUA
 */
export class DownloadService {
  async getDownloadBlob(document: DuaDocument): Promise<Blob> {
    if (!document.outputUrl) throw new NotFoundError("DUA output file");
    return StorageClient.downloadFile(document.outputUrl);
  }
}
