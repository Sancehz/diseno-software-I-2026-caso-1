"use client";
import { DashboardShell } from "@/components/templates/DashboardShell";
import { ResultsPanel } from "@/components/organisms/ResultsPanel";
import type { DuaDocument } from "@/models";

/** Page: results — shows generated DUA document preview and download. */
export function ResultsPage({ document }: { document: DuaDocument }) {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <h1 className="text-lg font-semibold">Generated DUA</h1>
        <ResultsPanel document={document} />
      </div>
    </DashboardShell>
  );
}
