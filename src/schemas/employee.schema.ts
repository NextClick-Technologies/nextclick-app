import { z } from "zod";

export const employeeSchema = z.object({
  title: z.enum(["mr", "mrs", "ms", "dr", "prof", "sr"]).optional().nullable(),
  name: z.string().min(1, "Name is required"),
  familyName: z.string().min(1, "Family name is required"),
  preferredName: z.string().optional().nullable(),
  gender: z.enum(["male", "female", "other"]),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  photo: z.string().url().optional().nullable(),
  userId: z.string().optional().nullable(),
});

export const updateEmployeeSchema = employeeSchema.partial();

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
