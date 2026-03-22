import { AzureOpenAIClient } from "@/api/AzureOpenAIClient";
import { NotificationService } from "@/notifications/NotificationService";
import { GenerateDuaRequestSchema } from "@/validation";
import { ValidationError } from "@/exceptions/AppError";
import { logger } from "@/logging/logger";
import type { DuaDocument } from "@/models";
import { v4 as uuid } from "uuid";

/**
 * DuaService — AI generation orchestration and template mapping.
 *
 * Design pattern: Builder (ReportBuilder coordinates document assembly)
 * Permission required: GENERATE_DUA
 */
export class DuaService {
  async generate(request: unknown): Promise<DuaDocument> {
    const parsed = GenerateDuaRequestSchema.safeParse(request);
    if (!parsed.success) throw new ValidationError(parsed.error.message);

    const { templateFileId, sourceFileIds } = parsed.data;

    NotificationService.publish({
      type: "PROCESS_EVENT",
      data: { type: "SCAN_TEMPLATE_START", message: "Scanning DUA template", timestamp: new Date() },
    });

    logger.info("DuaService.generate started", { templateFileId, fileCount: sourceFileIds.length });

    // TODO: read and parse template via DocumentParserStrategy
    NotificationService.publish({
      type: "PROCESS_EVENT",
      data: { type: "SCAN_TEMPLATE_COMPLETE", message: "Template scanned", timestamp: new Date() },
    });

    NotificationService.publish({
      type: "PROCESS_EVENT",
      data: { type: "GENERATION_START", message: "Starting AI field extraction", timestamp: new Date() },
    });

    // TODO: read each source file, extract text, pass to AzureOpenAIClient
    const fields = await AzureOpenAIClient.extractDuaFields("placeholder extracted text");

    return {
      id: uuid(),
      createdAt: new Date(),
      fields,
      outputUrl: null, // set after Word generation
      status: "complete",
    };
  }
}
