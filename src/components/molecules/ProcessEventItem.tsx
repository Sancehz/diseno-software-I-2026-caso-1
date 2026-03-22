"use client";
import type { ProcessEvent } from "@/models";
import { formatDate } from "@/utils/formatters";

/** Molecule: single row in the process monitoring event list. */
export function ProcessEventItem({ event }: { event: ProcessEvent }) {
  const isError = event.type === "PROCESS_ERROR";
  return (
    <li className={`flex items-start gap-3 py-2 text-sm ${isError ? "text-destructive" : "text-foreground"}`}>
      <span className="shrink-0 text-muted-foreground text-xs mt-0.5">
        {formatDate(event.timestamp)}
      </span>
      <span>{event.message}</span>
      {isError && event.error && (
        <span className="text-xs text-destructive/70 ml-1">({event.error})</span>
      )}
    </li>
  );
}
