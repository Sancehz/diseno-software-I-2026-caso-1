"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { NotificationService } from "@/notifications/NotificationService";
import { useProcessStore } from "@/store/useProcessStore";
import type { NotificationPayload } from "@/notifications/NotificationTypes";

/**
 * useNotifications — subscribes to NotificationService and routes events
 * to Sonner toasts and the process store.
 * Design pattern: Observer (subscribe/unsubscribe lifecycle)
 */
export function useNotifications() {
  const addEvent = useProcessStore((s) => s.addEvent);
  const setStatus = useProcessStore((s) => s.setStatus);

  useEffect(() => {
    const unsub = NotificationService.subscribe((payload: NotificationPayload) => {
      switch (payload.type) {
        case "TOAST_SUCCESS":
          toast.success(payload.message);
          break;
        case "TOAST_ERROR":
          toast.error(payload.message);
          break;
        case "TOAST_INFO":
          toast.info(payload.message);
          break;
        case "PROCESS_EVENT":
          addEvent(payload.data);
          if (payload.data.type === "PROCESS_ERROR") setStatus("error");
          break;
      }
    });
    return unsub;
  }, [addEvent, setStatus]);
}
