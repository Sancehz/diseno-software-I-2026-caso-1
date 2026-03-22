import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-utils";
import { TemplateService } from "@/services/TemplateService";
import { AppError } from "@/exceptions/AppError";

const templateService = new TemplateService();

/** GET /api/templates — permission: EDIT_TEMPLATES (Manager) */
export async function GET() {
  try {
    await requirePermission("EDIT_TEMPLATES");
    const templates = await templateService.listTemplates();
    return NextResponse.json(templates);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
