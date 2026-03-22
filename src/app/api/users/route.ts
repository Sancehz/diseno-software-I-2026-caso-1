import { NextRequest, NextResponse } from "next/server";
import { requirePermission } from "@/lib/auth-utils";
import { UserService } from "@/services/UserService";
import { AppError } from "@/exceptions/AppError";

const userService = new UserService();

/** GET /api/users — permission: MANAGE_USERS (Manager) */
export async function GET() {
  try {
    await requirePermission("MANAGE_USERS");
    return NextResponse.json([]);
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** POST /api/users — permission: MANAGE_USERS (Manager) */
export async function POST(req: NextRequest) {
  try {
    await requirePermission("MANAGE_USERS");
    const body = await req.json();
    const user = await userService.createUser(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
