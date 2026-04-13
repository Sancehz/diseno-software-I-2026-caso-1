import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "DUA Streamliner",
  description: "Intelligent system for DUA document generation",
};

/** Root layout — wraps all pages with Auth.js SessionProvider and Sonner Toaster. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          {children}
          <Toaster richColors position="top-right" />
        </SessionProvider>
      </body>
    </html>
  );
}
