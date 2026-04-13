"use client";
import { useDownload } from "@/hooks/useDownload";
import { useAuth } from "@/hooks/useAuth";
import { DuaFieldRow } from "@/components/molecules/DuaFieldRow";
import { Button } from "@/components/atoms/Button";
import type { DuaDocument } from "@/models";

/**
 * Organism: results panel — DUA field preview table + download action.
 * Download button is gated by DOWNLOAD_DUA permission (Customs Agent).
 */
export function ResultsPanel({ document }: { document: DuaDocument }) {
  const { downloadDocument } = useDownload();
  const { can } = useAuth();

  return (
    <section className="space-y-6">
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b bg-muted/40 text-xs text-muted-foreground">
              <th className="px-4 py-2 font-medium">Code</th>
              <th className="px-4 py-2 font-medium">Field</th>
              <th className="px-4 py-2 font-medium">Extracted value</th>
              <th className="px-4 py-2 font-medium">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {document.fields.map((f) => (
              <DuaFieldRow key={f.code} field={f} />
            ))}
          </tbody>
        </table>
      </div>
      {can("DOWNLOAD_DUA") && (
        <Button onClick={() => downloadDocument(document)}>
          Download DUA (.docx)
        </Button>
      )}
    </section>
  );
}
