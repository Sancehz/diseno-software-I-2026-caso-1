import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-utils";
import { DuaService } from "@/services/DuaService";
import { AppError } from "@/exceptions/AppError";
import { logger } from "@/logging/logger";

const duaService = new DuaService();

/** POST /api/dua/generate — permission: GENERATE_DUA (Customs Agent) */
export async function POST(req: NextRequest) {
  try {
    await requirePermission("GENERATE_DUA");
    const body = await req.json();
    const document = await duaService.generate(body);
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    logger.error(error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
