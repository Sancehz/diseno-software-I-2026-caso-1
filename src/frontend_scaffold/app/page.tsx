import { redirect } from "next/navigation";

/**
 * Root route — immediately redirects.
 * Authenticated users → /streamliner
 * Unauthenticated users → middleware redirects to /login
 */
export default function RootPage() {
  redirect("/streamliner");
}
