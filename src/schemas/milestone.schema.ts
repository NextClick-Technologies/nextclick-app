import { z } from "zod";

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

export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
