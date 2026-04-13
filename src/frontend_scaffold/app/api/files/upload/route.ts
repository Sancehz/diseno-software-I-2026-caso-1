import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-utils";
import { FileService } from "@/services/FileService";
import { AppError } from "@/exceptions/AppError";
import { logger } from "@/logging/logger";

const fileService = new FileService();

/** POST /api/files/upload — permission: LOAD_FILES (Customs Agent) */
export async function POST(req: NextRequest) {
  try {
    await requirePermission("LOAD_FILES");
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const processed = await fileService.processUploadedFiles(files);
    return NextResponse.json(processed, { status: 201 });
  } catch (error) {
    logger.error(error as Error);
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
