"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFileUpload } from "@/hooks/useFileUpload";

/**
 * Molecule: drag-and-drop file upload area.
 * Uses React Dropzone 14.2.
 * Delegates to useFileUpload hook → FileService.
 */
export function FileDropzone() {
  const { handleFiles, isUploading, error } = useFileUpload();
  const onDrop = useCallback((accepted: File[]) => handleFiles(accepted), [handleFiles]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
        ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/30 hover:border-primary/60"}`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <p className="text-sm text-muted-foreground">Uploading files…</p>
      ) : isDragActive ? (
        <p className="text-sm text-primary">Drop files here</p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Drag and drop files here, or click to select
        </p>
      )}
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
