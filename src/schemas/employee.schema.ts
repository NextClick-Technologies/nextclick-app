import { z } from "zod";
import { Title, Gender } from "@/types";

export const employeeSchema = z.object({
  title: z.enum(Title).optional().nullable(),
  name: z.string().min(1, "Name is required"),
  familyName: z.string().min(1, "Family name is required"),
  preferredName: z.string().optional().nullable(),
  gender: z.enum(Gender),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.email("Invalid email address"),
  photo: z.string().url().optional().nullable(),
  userId: z.uuid().optional().nullable(),
});

export const updateEmployeeSchema = employeeSchema.partial();

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
