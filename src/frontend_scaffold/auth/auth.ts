import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Exported Auth.js helpers.
 * Import `auth`     for server-side session reads.
 * Import `signIn`   for server actions.
 * Import `signOut`  for server actions.
 * Import `handlers` for the [...nextauth] API route.
 */
export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);
