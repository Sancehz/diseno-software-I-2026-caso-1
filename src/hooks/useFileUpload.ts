"use client";
import { useState } from "react";
import { FileService } from "@/services/FileService";
import { useProcessStore } from "@/store/useProcessStore";
import type { SourceFile } from "@/models";

/**
 * useFileUpload — manages file selection and validation for React Dropzone.
 * Calls FileService to upload and pre-process selected files.
 * Design pattern: Singleton (FileService)
 */
export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setSourceFiles = useProcessStore((s) => s.setSourceFiles);
  const fileService = new FileService();

  async function handleFiles(files: File[]) {
    setIsUploading(true);
    setError(null);
    try {
      const processed: SourceFile[] = await fileService.processUploadedFiles(files);
      setSourceFiles(processed);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsUploading(false);
    }
  }

  return { handleFiles, isUploading, error };
}
