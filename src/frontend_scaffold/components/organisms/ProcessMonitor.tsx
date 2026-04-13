"use client";
import { useProcessStore } from "@/store/useProcessStore";
import { ProcessEventItem } from "@/components/molecules/ProcessEventItem";
import { Spinner } from "@/components/atoms/Spinner";

/**
 * Organism: live process monitoring panel.
 * Subscribes to process store populated by NotificationService callbacks.
 * Shown during scanning_template, scanning_files, and generating stages.
 */
export function ProcessMonitor() {
  const { events, status } = useProcessStore();
  const isRunning = !["complete", "error", "pending"].includes(status);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        {isRunning && <Spinner size={16} />}
        <h2 className="text-sm font-medium capitalize">
          {status === "complete"
            ? "Generation complete"
            : status === "error"
            ? "Error occurred"
            : status.replace("_", " ")}
        </h2>
      </div>
      <ul className="max-h-64 overflow-y-auto divide-y rounded-lg border px-4">
        {events.length === 0 ? (
          <li className="py-4 text-sm text-muted-foreground text-center">Waiting for events…</li>
        ) : (
          events.map((e, i) => <ProcessEventItem key={i} event={e} />)
        )}
      </ul>
    </section>
  );
}
