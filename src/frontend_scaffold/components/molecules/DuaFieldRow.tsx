"use client";
import type { DuaField } from "@/models";
import { ConfidenceIndicator } from "@/components/atoms/ConfidenceIndicator";

/** Molecule: single DUA field row in the results preview table. */
export function DuaFieldRow({ field }: { field: DuaField }) {
  return (
    <tr className="border-b last:border-none">
      <td className="py-2 pr-4 text-xs text-muted-foreground font-mono">{field.code}</td>
      <td className="py-2 pr-4 text-sm">{field.label}</td>
      <td className="py-2 pr-4 text-sm">
        {field.value ?? <span className="text-muted-foreground italic">—</span>}
      </td>
      <td className="py-2">
        <ConfidenceIndicator confidence={field.confidence} />
      </td>
    </tr>
  );
}
