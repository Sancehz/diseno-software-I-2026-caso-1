import { requirePermission } from "@/lib/auth-utils";
import { ReportService } from "@/services/ReportService";

/** Reports page — Manager only (VIEW_REPORTS permission). */
export default async function Page() {
  await requirePermission("VIEW_REPORTS");
  const reportService = new ReportService();
  const summary = await reportService.getOperationalSummary();
  return (
    <div>
      <h1>Operational Reports</h1>
      <pre>{JSON.stringify(summary, null, 2)}</pre>
    </div>
  );
}
