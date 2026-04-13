import { NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-utils";
import { ReportService } from "@/services/ReportService";
import { AppError } from "@/exceptions/AppError";

const reportService = new ReportService();

/** GET /api/reports — permission: VIEW_REPORTS (Manager) */
export async function GET() {
  try {
    await requirePermission("VIEW_REPORTS");
    const summary = await reportService.getOperationalSummary();
    return NextResponse.json(summary);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
