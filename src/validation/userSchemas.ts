import { z } from "zod";

export const UserRoleSchema = z.enum(["Manager", "CustomsAgent"]);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: UserRoleSchema,
});

export const CreateUserSchema = UserSchema.omit({ id: true });
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
