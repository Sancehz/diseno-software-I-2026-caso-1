import type { SourceFileType } from "@/models";

const EXT_MAP: Record<string, SourceFileType> = {
  docx: "word",
  doc: "word",
  xlsx: "excel",
  xls: "excel",
  pdf: "pdf",
  png: "image",
  jpg: "image",
  jpeg: "image",
  tiff: "image",
  tif: "image",
};

export function getFileType(filename: string): SourceFileType {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return EXT_MAP[ext] ?? "unknown";
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}
