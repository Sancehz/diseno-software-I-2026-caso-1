"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/atoms/Button";
import { PageLayout } from "@/components/templates/PageLayout";

/**
 * Page: login — delegates authentication entirely to Azure Entra ID via Auth.js.
 * No password field is rendered; the user is redirected to the Entra ID sign-in.
 * MFA (mobile authenticator) is enforced upstream by Entra Conditional Access.
 */
export function LoginPage() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">DUA Streamliner</h1>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Sign in with your organisation account to continue.
        </p>
        <Button onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/streamliner" })}>
          Sign in with Microsoft
        </Button>
      </div>
    </PageLayout>
  );
}
