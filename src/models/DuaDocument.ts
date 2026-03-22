/** Confidence level for an extracted DUA field. */
export type FieldConfidence = "high" | "medium" | "low" | "missing";

export interface DuaField {
  code: string;
  label: string;
  value: string | null;
  confidence: FieldConfidence;
  source: string | null; // which source file this value was extracted from
}

export interface DuaDocument {
  id: string;
  createdAt: Date;
  fields: DuaField[];
  /** Path/URL of the generated Word document. */
  outputUrl: string | null;
  status: DuaDocumentStatus;
}

export type DuaDocumentStatus =
  | "pending"
  | "scanning_template"
  | "scanning_files"
  | "generating"
  | "complete"
  | "error";
