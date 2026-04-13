/** Emitted by NotificationService during DUA generation stages. */
export type ProcessEventType =
  | "SCAN_TEMPLATE_START"
  | "SCAN_TEMPLATE_COMPLETE"
  | "SCAN_FILE_START"
  | "SCAN_FILE_COMPLETE"
  | "GENERATION_START"
  | "GENERATION_COMPLETE"
  | "PROCESS_ERROR";

export interface ProcessEvent {
  type: ProcessEventType;
  message: string;
  fileId?: string;
  timestamp: Date;
  error?: string;
}
