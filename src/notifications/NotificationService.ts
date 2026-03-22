import type { NotificationCallback, NotificationPayload } from "./NotificationTypes";

/**
 * NotificationService — lightweight pub/sub for async API callbacks.
 *
 * Design pattern: Observer
 *
 * All asynchronous API calls resolve by publishing here rather than
 * returning values directly. This decouples UI components from API
 * latency and aligns with the Notification Service architecture spec.
 *
 * Usage:
 *   // Subscribe (typically in a hook)
 *   const unsub = NotificationService.subscribe(payload => { ... });
 *   // Publish (typically in an ApiClient or Service)
 *   NotificationService.publish({ type: "TOAST_SUCCESS", message: "Done!" });
 *   // Cleanup
 *   unsub();
 */
class _NotificationService {
  private subscribers: Set<NotificationCallback> = new Set();

  subscribe(callback: NotificationCallback): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  publish(payload: NotificationPayload): void {
    this.subscribers.forEach((cb) => cb(payload));
  }
}

// Singleton instance
export const NotificationService = new _NotificationService();
