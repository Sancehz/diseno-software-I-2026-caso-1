import type { User } from "@/models";
import { CreateUserSchema } from "@/validation";
import { ValidationError } from "@/exceptions/AppError";

/**
 * UserService — user management CRUD.
 * Permission required: MANAGE_USERS (Manager only)
 */
export class UserService {
  async createUser(data: unknown): Promise<User> {
    const parsed = CreateUserSchema.safeParse(data);
    if (!parsed.success) throw new ValidationError(parsed.error.message);
    // TODO: persist to database
    return { id: crypto.randomUUID(), ...parsed.data };
  }
}
