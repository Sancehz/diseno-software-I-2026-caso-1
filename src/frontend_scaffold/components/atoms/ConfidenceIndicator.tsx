"use client";
import type { FieldConfidence } from "@/models";

const COLOR: Record<FieldConfidence, string> = {
  high: "bg-green-500",
  medium: "bg-yellow-400",
  low: "bg-orange-500",
  missing: "bg-red-500",
};

/** Atom: coloured dot encoding DUA field extraction confidence. */
export function ConfidenceIndicator({ confidence }: { confidence: FieldConfidence }) {
  return (
    <span
      title={confidence}
      className={`inline-block w-2.5 h-2.5 rounded-full ${COLOR[confidence]}`}
    />
  );
}
