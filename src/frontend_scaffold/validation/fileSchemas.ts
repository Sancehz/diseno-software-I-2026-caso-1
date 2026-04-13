import { z } from "zod";

const ALLOWED_EXTENSIONS = ["docx", "xlsx", "pdf", "png", "jpg", "jpeg", "tiff"];

export const SourceFileSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  type: z.enum(["word", "excel", "pdf", "image", "unknown"]),
  sizeBytes: z.number().positive(),
  relativePath: z.string().min(1),
});

export const FileUploadSchema = z.object({
  name: z.string().refine(
    (n) => ALLOWED_EXTENSIONS.some((ext) => n.toLowerCase().endsWith(`.${ext}`)),
    { message: `File must be one of: ${ALLOWED_EXTENSIONS.join(", ")}` }
  ),
  size: z.number().max(50 * 1024 * 1024, "File must be under 50 MB"),
});
