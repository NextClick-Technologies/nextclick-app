import { z } from "zod";

export const userRoles = ["admin", "manager", "employee", "viewer"] as const;

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(userRoles, {
    message: "Invalid role",
  }),
});

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(userRoles).optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
