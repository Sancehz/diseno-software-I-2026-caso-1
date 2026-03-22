"use client";
import type { ReactNode } from "react";

/** Template: minimal full-page wrapper with centred max-width content area. */
export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
