"use client";
import { DownloadService } from "@/services/DownloadService";
import type { DuaDocument } from "@/models";

/**
 * useDownload — triggers client-side download of the generated DUA file.
 * Permission required: DOWNLOAD_DUA
 */
export function useDownload() {
  const downloadService = new DownloadService();

  async function downloadDocument(document: DuaDocument) {
    const blob = await downloadService.getDownloadBlob(document);
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement("a");
    a.href = url;
    a.download = `DUA_${document.id}.docx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return { downloadDocument };
}
