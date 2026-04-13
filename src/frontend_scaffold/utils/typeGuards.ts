import type { UserRole } from "@/models";

export function isUserRole(value: unknown): value is UserRole {
  return value === "Manager" || value === "CustomsAgent";
}

export function isNonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
