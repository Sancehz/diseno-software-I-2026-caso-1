/** ISO date string → human-readable "Jan 5, 2025 14:30" */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("es-CR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

/** Truncate long strings for display. */
export function truncate(str: string, maxLength = 40): string {
  return str.length > maxLength ? `${str.slice(0, maxLength - 1)}…` : str;
}
