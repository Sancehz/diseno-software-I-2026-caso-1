"use client";
import { useSession } from "next-auth/react";
import { hasPermission, type Permission } from "@/lib/permissions";
import { isUserRole } from "@/utils/typeGuards";

/**
 * useAuth — client-side session reads and role/permission checks.
 * Reads from the Auth.js client session (hydrated from the JWT cookie).
 */
export function useAuth() {
  const { data: session, status } = useSession();
  const user = session?.user as { name: string; email: string; role: string } | undefined;
  const role = user?.role && isUserRole(user.role) ? user.role : null;

  return {
    user,
    role,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    can: (permission: Permission) => (role ? hasPermission(role, permission) : false),
  };
}
