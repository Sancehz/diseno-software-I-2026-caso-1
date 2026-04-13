import type { ProcessEvent } from "@/models";

/**
 * All async events the NotificationService can dispatch.
 * ApiClients emit these after long-running calls resolve.
 * Hooks subscribe via useNotifications() to update UI state.
 */
export type NotificationPayload =
  | { type: "PROCESS_EVENT"; data: ProcessEvent }
  | { type: "TOAST_SUCCESS"; message: string }
  | { type: "TOAST_ERROR"; message: string }
  | { type: "TOAST_INFO"; message: string };

export type NotificationCallback = (payload: NotificationPayload) => void;
