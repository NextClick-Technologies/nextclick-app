import { z } from "zod";

export const milestoneSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  startDate: z.string().min(1, "Start date is required"),
  finishDate: z.string().min(1, "Finish date is required"),
  completionDate: z.string().optional().nullable(),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]),
  remarks: z.string().optional().nullable(),
  order: z.number().int().nonnegative().optional(),
  projectId: z.uuid("Project ID is required"),
});

export const updateMilestoneSchema = milestoneSchema.partial();

export type MilestoneInput = z.infer<typeof milestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
