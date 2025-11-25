import { z } from "zod";

// Client schemas
export const clientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.enum(["mr", "mrs", "ms", "dr", "prof", "sr"]).optional().nullable(),
  familyName: z.string().min(1, "Family name is required"),
  gender: z.enum(["male", "female", "other"]),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
});

export const updateClientSchema = clientSchema.partial();

// Company schemas
export const companySchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  address: z.string().min(1, "Address is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
});

export const updateCompanySchema = companySchema.partial();

// Project schemas
export const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  startDate: z.string().datetime(),
  finishDate: z.string().datetime(),
  budget: z.string().min(1, "Budget is required"),
  paymentTerms: z.enum(["net_30d", "net_60d", "net_90d", "immediate"]),
  status: z.enum(["active", "completed", "on_hold", "cancelled"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  description: z.string().min(1, "Description is required"),
  completionDate: z.string().datetime().optional().nullable(),
  clientId: z.string().min(1, "Client ID is required"),
});

export const updateProjectSchema = projectSchema.partial();

// Milestone schemas
export const milestoneSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().datetime(),
  finishDate: z.string().datetime(),
  completionDate: z.string().datetime().optional().nullable(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  remarks: z.string().optional().nullable(),
  projectId: z.string().min(1, "Project ID is required"),
});

export const updateMilestoneSchema = milestoneSchema.partial();

// Payment schemas
export const paymentSchema = z.object({
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  status: z.enum(["pending", "completed", "failed"]),
  date: z.string().datetime(),
  method: z.enum(["cash", "bank_transfer", "credit_card", "cheque"]),
  projectId: z.string().min(1, "Project ID is required"),
});

export const updatePaymentSchema = paymentSchema.partial();

// Employee schemas
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

// Communication Log schemas
export const communicationLogSchema = z.object({
  date: z.string().datetime(),
  channel: z.enum(["email", "phone", "chat", "meeting", "video_call"]),
  summary: z.string().min(1, "Summary is required"),
  followUpRequired: z.boolean(),
  followUpDate: z.string().datetime().optional().nullable(),
  clientId: z.string().min(1, "Client ID is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
});

export const updateCommunicationLogSchema = communicationLogSchema.partial();

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
  orderBy: z.string().optional(),
});

export type ClientInput = z.infer<typeof clientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type CompanyInput = z.infer<typeof companySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
export type EmployeeInput = z.infer<typeof employeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type CommunicationLogInput = z.infer<typeof communicationLogSchema>;
export type UpdateCommunicationLogInput = z.infer<typeof updateCommunicationLogSchema>;
export type PaginationParams = z.infer<typeof paginationSchema>;
