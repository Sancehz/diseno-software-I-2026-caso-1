import { settings } from "@/config/settings";
import { NotificationService } from "@/notifications/NotificationService";
import { ExternalServiceError } from "@/exceptions/AppError";
import { logger } from "@/logging/logger";
import type { DuaField } from "@/models";
import { DuaFieldSchema } from "@/validation";
import { z } from "zod";

/**
 * AzureOpenAIClient — communicates with Azure OpenAI (GPT + OCR).
 *
 * Design pattern: Singleton
 * All async results are published via NotificationService callbacks,
 * not returned directly, per the async architecture specification.
 */
class _AzureOpenAIClient {
  private readonly endpoint = settings.azure.openAiEndpoint;
  private readonly apiKey = settings.azure.openAiApiKey;

  /**
   * Sends extracted document text to the AI model for DUA field mapping.
   * Publishes PROCESS_EVENT notifications on progress and completion.
   */
  async extractDuaFields(documentText: string): Promise<DuaField[]> {
    try {
      const response = await fetch(`${this.endpoint}/openai/deployments/gpt-4o/chat/completions?api-version=2024-02-01`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": this.apiKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "You are a customs document expert. Extract DUA fields from the provided text and return a JSON array of DuaField objects.",
            },
            { role: "user", content: documentText },
          ],
          max_tokens: 2000,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        throw new ExternalServiceError("AzureOpenAI", `HTTP ${response.status}`);
      }

      const data = await response.json();
      const rawFields = JSON.parse(data.choices[0].message.content);
      const fields = z.array(DuaFieldSchema).parse(rawFields);

      NotificationService.publish({
        type: "PROCESS_EVENT",
        data: { type: "GENERATION_COMPLETE", message: "AI field extraction complete", timestamp: new Date() },
      });

      return fields;
    } catch (error) {
      logger.error(error as Error, { context: "AzureOpenAIClient.extractDuaFields" });
      NotificationService.publish({
        type: "PROCESS_EVENT",
        data: { type: "PROCESS_ERROR", message: "AI extraction failed", timestamp: new Date(), error: String(error) },
      });
      throw error;
    }
  }
}

// Singleton instance — design pattern: Singleton
export const AzureOpenAIClient = new _AzureOpenAIClient();
