import { z } from "zod";
import { Title, Gender } from "@/features/clients/domain/types";
import { EmployeeStatus } from "./types";

export const employeeSchema = z.object({
  title: z.nativeEnum(Title).optional().nullable(),
  name: z.string().min(1, "Name is required"),
  familyName: z.string().min(1, "Family name is required"),
  preferredName: z.string().optional().nullable(),
  gender: z.nativeEnum(Gender),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  photo: z.string().url().optional().nullable(),
  userId: z.string().uuid().optional().nullable(),
  status: z.nativeEnum(EmployeeStatus).default(EmployeeStatus.ACTIVE),
  // Additional fields for future scalability
  department: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  joinDate: z.string().optional().nullable(),
  salary: z.number().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  emergencyPhone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
});

export const updateEmployeeSchema = employeeSchema.partial();

export type EmployeeInput = z.infer<typeof employeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
