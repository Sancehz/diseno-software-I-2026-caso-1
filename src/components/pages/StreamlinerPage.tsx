"use client";
import { DashboardShell } from "@/components/templates/DashboardShell";
import { FileSelector } from "@/components/organisms/FileSelector";
import { ProcessMonitor } from "@/components/organisms/ProcessMonitor";
import { Button } from "@/components/atoms/Button";
import { PermissionGate } from "@/components/auth/PermissionGate";
import { useDuaGeneration } from "@/hooks/useDuaGeneration";
import { useNotifications } from "@/hooks/useNotifications";
import { useProcessStore } from "@/store/useProcessStore";

/**
 * Page: streamliner — configuration + generation trigger + live monitoring.
 * Permissions required: LOAD_FILES (file selector), GENERATE_DUA (trigger).
 */
export function StreamlinerPage() {
  useNotifications(); // subscribe to NotificationService for the lifetime of this page
  const { generate, isGenerating } = useDuaGeneration();
  const { status, sourceFiles } = useProcessStore();
  const isConfigured = sourceFiles.length > 0;

  return (
    <DashboardShell>
      <div className="space-y-10">
        <PermissionGate permission="LOAD_FILES">
          <FileSelector />
        </PermissionGate>
        {(status !== "pending") && <ProcessMonitor />}
        <PermissionGate permission="GENERATE_DUA">
          <Button
            onClick={() => generate()}
            disabled={!isConfigured || isGenerating}
          >
            {isGenerating ? "Generating…" : "Generate DUA"}
          </Button>
        </PermissionGate>
      </div>
    </DashboardShell>
  );
}
