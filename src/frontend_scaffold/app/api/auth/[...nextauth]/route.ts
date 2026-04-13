import { handlers } from "@/auth/auth";

/**
 * Auth.js catch-all route.
 * Handles /api/auth/signin, /api/auth/callback/microsoft-entra-id, etc.
 */
export const { GET, POST } = handlers;
