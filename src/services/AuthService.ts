import { auth } from "@/auth/auth";
import { hasPermission, type Permission } from "@/lib/permissions";
import { AuthenticationError, AuthorizationError } from "@/exceptions/AppError";
import type { UserRole } from "@/models";

/**
 * AuthService — session resolution and permission validation.
 * Permission: called by any service that needs to gate an operation.
 */
export class AuthService {
  async getSession() {
    const session = await auth();
    if (!session?.user) throw new AuthenticationError();
    return session.user as { name: string; email: string; role: UserRole };
  }

  async assertPermission(permission: Permission) {
    const user = await this.getSession();
    if (!hasPermission(user.role, permission)) {
      throw new AuthorizationError(permission);
    }
    return user;
  }
}
