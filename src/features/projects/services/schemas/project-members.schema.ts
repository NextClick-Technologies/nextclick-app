import { z } from "zod";

/**
 * Schema for adding a team member to a project (by employeeId)
 */
export const addTeamMemberSchema = z.object({
  employeeId: z.string().uuid("Invalid employee ID"),
  role: z.string().optional(),
});

/**
 * Schema for assigning a user to a project (by userId - for global management)
 */
export const assignProjectMemberSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  userId: z.string().uuid("Invalid user ID"),
  role: z.string().optional(),
});

/**
 * Schema for project member record (matches database.type.ts Row type)
 */
export const projectMemberSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.string().nullable(),
  createdAt: z.string(),
});

/**
 * Schema for creating a project member (matches database.type.ts Insert type)
 */
export const createProjectMemberSchema = z.object({
  id: z.string().uuid().optional(),
  projectId: z.string().uuid(),
  userId: z.string().uuid(),
  role: z.string().optional().nullable(),
  createdAt: z.string().optional(),
});

export const updateProjectMemberSchema = z.object({
  role: z.string().nullable().optional(),
});

export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;
export type AssignProjectMemberInput = z.infer<
  typeof assignProjectMemberSchema
>;
export type ProjectMember = z.infer<typeof projectMemberSchema>;
export type CreateProjectMemberInput = z.infer<
  typeof createProjectMemberSchema
>;
export type UpdateProjectMemberInput = z.infer<
  typeof updateProjectMemberSchema
>;
