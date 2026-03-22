"use client";
import type { ReactNode } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/atoms/Button";
import { useAuth } from "@/hooks/useAuth";
import { useProcessStore } from "@/store/useProcessStore";

/**
 * Template: authenticated dashboard shell.
 * Shows top navigation bar with user info and a conditional logout button.
 * Logout is disabled while a generation is in progress (per UX spec).
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { status } = useProcessStore();
  const canLogout = !["scanning_template", "scanning_files", "generating"].includes(status);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-sm tracking-tight">DUA Streamliner</span>
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground">{user?.email}</span>
          {canLogout && (
            <Button variant="outline" size="sm" onClick={() => signOut()}>
              Sign out
            </Button>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
