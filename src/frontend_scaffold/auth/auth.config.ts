import type { NextAuthConfig } from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { settings } from "@/config/settings";

/**
 * Auth.js configuration.
 * Identity provider : Azure Entra ID (customsidentityserver)
 * SSO               : Enabled via Entra ID tenant session
 * MFA               : Enforced by Entra ID Conditional Access — mobile authenticator app only
 * Session strategy  : JWT (stateless; Vercel has no native session store)
 */
export const authConfig: NextAuthConfig = {
  providers: [
    MicrosoftEntraID({
      clientId: settings.azure.clientId,
      clientSecret: settings.azure.clientSecret,
      tenantId: settings.azure.tenantId,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.role = (profile as any).roles?.[0] ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role ?? null;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      if (!isLoggedIn && !isOnLogin) return false;
      if (isLoggedIn && isOnLogin) return Response.redirect(new URL("/streamliner", nextUrl));
      return true;
    },
  },
  pages: { signIn: "/login" },
};
