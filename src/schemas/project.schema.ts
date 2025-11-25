import { z } from "zod";

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

export type ProjectInput = z.infer<typeof projectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
