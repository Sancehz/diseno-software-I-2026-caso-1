"use client";
/** Atom: animated loading spinner using Tailwind + inline SVG. */
export function Spinner({ size = 20 }: { size?: number }) {
  return (
    <svg
      className="animate-spin text-muted-foreground"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
    </svg>
  );
}
