/** Roles as defined in the RBAC specification. */
export type UserRole = "Manager" | "CustomsAgent";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}
