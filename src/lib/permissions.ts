import type { UserRole } from "@/models";

/**
 * Permission codes — RBAC specification.
 *
 * Manager permissions:
 *   MANAGE_USERS   — Create, read, update, delete user accounts
 *   VIEW_REPORTS   — Access operational and performance reports
 *   EDIT_TEMPLATES — Modify or replace available DUA templates
 *
 * Customs Agent permissions:
 *   LOAD_FILES     — Configure and upload a folder of source data files
 *   GENERATE_DUA   — Trigger the AI-driven DUA generation process
 *   DOWNLOAD_DUA   — Download the completed DUA document
 */
export type Permission =
  | "MANAGE_USERS"
  | "VIEW_REPORTS"
  | "EDIT_TEMPLATES"
  | "LOAD_FILES"
  | "GENERATE_DUA"
  | "DOWNLOAD_DUA";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Manager: ["MANAGE_USERS", "VIEW_REPORTS", "EDIT_TEMPLATES"],
  CustomsAgent: ["LOAD_FILES", "GENERATE_DUA", "DOWNLOAD_DUA"],
};

/**
 * Returns true when the given role includes the requested permission.
 * Use in server route handlers AND in the PermissionGate component.
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}
