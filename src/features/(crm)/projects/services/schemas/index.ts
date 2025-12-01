import { z } from "zod";
import { PaymentTerms, ProjectStatus, ProjectPriority } from "../types";

export const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  type: z.string().optional(),
  startDate: z.string().optional().nullable(),
  finishDate: z.string().optional().nullable(),
  budget: z.number().optional(),
  paymentTerms: z
    .nativeEnum(PaymentTerms)
    .optional()
    .default(PaymentTerms.NET_30D),
  status: z.nativeEnum(ProjectStatus).optional().default(ProjectStatus.ACTIVE),
  priority: z
    .nativeEnum(ProjectPriority)
    .optional()
    .default(ProjectPriority.MEDIUM),
  description: z.string().optional(),
  completionDate: z.string().optional().nullable(),
  clientId: z.string().uuid("Please select a client"),
  projectManager: z.string().uuid().optional().nullable(),
});

export const updateProjectSchema = projectSchema.partial();

export type ProjectInput = z.input<typeof projectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
