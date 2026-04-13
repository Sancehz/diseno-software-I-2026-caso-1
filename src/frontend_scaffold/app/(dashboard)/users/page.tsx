import { requirePermission } from "@/lib/auth-utils";

/** User management page — Manager only (MANAGE_USERS permission). */
export default async function Page() {
  await requirePermission("MANAGE_USERS");
  return <div>User Management</div>;
}
