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

/**
 * Milestone Members Schemas
 */

/**
 * Schema for adding a team member to a milestone (by employeeId)
 */
export const addMilestoneTeamMemberSchema = z.object({
  employeeId: z.string().uuid("Invalid employee ID"),
  role: z.string().optional(),
});

/**
 * Schema for milestone member record
 */
export const milestoneMemberSchema = z.object({
  id: z.string().uuid(),
  milestoneId: z.string().uuid(),
  employeeId: z.string().uuid(),
  role: z.string().nullable(),
  createdAt: z.string(),
});

export type AddMilestoneTeamMemberInput = z.infer<
  typeof addMilestoneTeamMemberSchema
>;
export type MilestoneMember = z.infer<typeof milestoneMemberSchema>;
