"use client";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import type { Permission } from "@/lib/permissions";

/**
 * PermissionGate — conditionally renders children based on RBAC permissions.
 *
 * Server-side equivalent: requirePermission() in lib/auth-utils.ts
 * Use this for client-rendered UI gating; use requirePermission() for API routes.
 */
export function PermissionGate({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const { can } = useAuth();
  return can(permission) ? <>{children}</> : <>{fallback}</>;
}
