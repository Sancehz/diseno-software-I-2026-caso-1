export type SourceFileType = "word" | "excel" | "pdf" | "image" | "unknown";

export interface SourceFile {
  id: string;
  name: string;
  type: SourceFileType;
  sizeBytes: number;
  /** Relative path within the uploaded folder. */
  relativePath: string;
}
