import { z } from "zod";
import { PaymentTerms, ProjectStatus, ProjectPriority } from "./types";

/**
 * Project Schemas
 */
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

/**
 * Project Members Schemas
 */

/**
 * Schema for adding a team member to a project (by employeeId)
 */
export const addTeamMemberSchema = z.object({
  employeeId: z.string().uuid("Invalid employee ID"),
  role: z.string().optional(),
});

/**
 * Schema for project member record (matches database.type.ts Row type)
 */
export const projectMemberSchema = z.object({
  id: z.string().uuid(),
  projectId: z.string().uuid(),
  employeeId: z.string().uuid(),
  role: z.string().nullable(),
  createdAt: z.string(),
});

/**
 * Schema for creating a project member (matches database.type.ts Insert type)
 */
export const createProjectMemberSchema = z.object({
  id: z.string().uuid().optional(),
  projectId: z.string().uuid(),
  employeeId: z.string().uuid(),
  role: z.string().optional().nullable(),
  createdAt: z.string().optional(),
});

export const updateProjectMemberSchema = z.object({
  role: z.string().nullable().optional(),
});

export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;
export type ProjectMember = z.infer<typeof projectMemberSchema>;
export type CreateProjectMemberInput = z.infer<
  typeof createProjectMemberSchema
>;
export type UpdateProjectMemberInput = z.infer<
  typeof updateProjectMemberSchema
>;
