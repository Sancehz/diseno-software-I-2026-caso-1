import { auth } from "@/auth/auth";
import type { UserRole } from "@/models";
import { hasPermission, type Permission } from "./permissions";

/**
 * Server-side helper — reads the current Auth.js session.
 * Returns null when no valid session exists.
 */
export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as { name: string; email: string; role: UserRole };
}

/**
 * Server action guard — throws if the current user lacks the required permission.
 * Use at the top of every API route handler and Server Action.
 */
export async function requirePermission(permission: Permission) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthenticated");
  if (!hasPermission(user.role, permission))
    throw new Error(`Forbidden: missing permission ${permission}`);
  return user;
}
