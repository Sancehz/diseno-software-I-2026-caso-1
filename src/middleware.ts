import { auth } from "@/auth/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Edge middleware — runs before every request.
 * Responsibilities:
 *   1. PBAC: reject requests whose origin country is not Costa Rica (CR).
 *   2. Auth guard: redirect unauthenticated users to /login.
 */
export default async function middleware(req: NextRequest) {
  // ── PBAC: geo-restriction to Costa Rica ──────────────────────────────────
  const country = req.geo?.country ?? req.headers.get("x-vercel-ip-country");
  if (country && country !== "CR") {
    return NextResponse.json(
      { error: "Access restricted to Costa Rica." },
      { status: 403 }
    );
  }

  // ── Auth guard (delegated to Auth.js) ───────────────────────────────────
  return auth(req as any);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
