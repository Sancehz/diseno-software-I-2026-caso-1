/** Returns true if date is within the last N minutes. */
export function isRecent(date: Date, minutes = 5): boolean {
  return Date.now() - date.getTime() < minutes * 60_000;
}
