import { z } from "zod";

export const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  type: z.string().optional(),
  startDate: z.iso.datetime().optional(),
  finishDate: z.iso.datetime().optional(),
  budget: z.coerce.number().optional(),
  paymentTerms: z
    .enum(["net_30d", "net_60d", "net_90d", "immediate"])
    .default("net_30d"),
  status: z
    .enum(["active", "completed", "on_hold", "cancelled"])
    .default("active"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  description: z.string().optional(),
  completionDate: z.string().datetime().optional().nullable(),
  clientId: z.uuid("Please select a client"),
});

export const updateProjectSchema = projectSchema.partial();

export type ProjectInput = z.input<typeof projectSchema>;
export type UpdateProjectInput = z.input<typeof updateProjectSchema>;
