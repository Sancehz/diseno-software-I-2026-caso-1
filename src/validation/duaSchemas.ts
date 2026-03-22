import { z } from "zod";

export const DuaFieldSchema = z.object({
  code: z.string().min(1),
  label: z.string().min(1),
  value: z.string().nullable(),
  confidence: z.enum(["high", "medium", "low", "missing"]),
  source: z.string().nullable(),
});

export const GenerateDuaRequestSchema = z.object({
  templateFileId: z.string().min(1),
  sourceFileIds: z.array(z.string().min(1)).min(1),
});

export type GenerateDuaRequest = z.infer<typeof GenerateDuaRequestSchema>;
