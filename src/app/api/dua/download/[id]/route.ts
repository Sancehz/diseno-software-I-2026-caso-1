import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-utils";
import { AppError } from "@/exceptions/AppError";

/** GET /api/dua/download/:id — permission: DOWNLOAD_DUA (Customs Agent) */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requirePermission("DOWNLOAD_DUA");
    // TODO: resolve DUA document by id and stream the .docx blob
    return NextResponse.json({ id: params.id });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
