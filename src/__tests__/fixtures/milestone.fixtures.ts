import { Milestone, MilestoneStatus } from "@/features/milestone/domain/types";
import type {
  Milestone as DbMilestone,
  MilestoneInsert as DbMilestoneInsert,
  MilestoneUpdate as DbMilestoneUpdate,
} from "@/shared/types/database.type";

/**
 * Mock Milestone data (frontend - camelCase)
 */
export const mockMilestone: Milestone = {
  id: "550e8400-e29b-41d4-a716-446655440401",
  projectId: "550e8400-e29b-41d4-a716-446655440201",
  name: "Phase 1: Requirements",
  description: "Gather and document all project requirements",
  startDate: "2024-01-20",
  finishDate: "2024-02-20",
  completionDate: null,
  status: MilestoneStatus.COMPLETED,
  remarks: "Completed ahead of schedule",
  order: 1,
  createdAt: "2024-01-20T10:00:00.000Z",
  updatedAt: "2024-02-15T10:00:00.000Z",
};

export const mockMilestone2: Milestone = {
  id: "550e8400-e29b-41d4-a716-446655440402",
  projectId: "550e8400-e29b-41d4-a716-446655440201",
  name: "Phase 2: Development",
  description: "Core development and implementation",
  startDate: "2024-02-21",
  finishDate: "2024-04-20",
  completionDate: null,
  status: MilestoneStatus.IN_PROGRESS,
  remarks: null,
  order: 2,
  createdAt: "2024-02-21T10:00:00.000Z",
  updatedAt: "2024-02-21T10:00:00.000Z",
};

export const mockMilestones: Milestone[] = [mockMilestone, mockMilestone2];

/**
 * Mock Milestone data (database - snake_case)
 */
export const mockDbMilestone: DbMilestone = {
  id: "550e8400-e29b-41d4-a716-446655440401",
  project_id: "550e8400-e29b-41d4-a716-446655440201",
  name: "Phase 1: Requirements",
  description: "Gather and document all project requirements",
  start_date: "2024-01-20",
  finish_date: "2024-02-20",
  completion_date: null,
  status: MilestoneStatus.COMPLETED,
  remarks: "Completed ahead of schedule",
  created_at: "2024-01-20T10:00:00.000Z",
  updated_at: "2024-02-15T10:00:00.000Z",
};

/**
 * Mock Milestone insert data (database - snake_case)
 */
export const mockMilestoneInsert: DbMilestoneInsert = {
  project_id: "550e8400-e29b-41d4-a716-446655440201",
  name: "Phase 3: Testing",
  description: "Quality assurance and testing",
  start_date: "2024-04-21",
  finish_date: "2024-05-20",
  status: MilestoneStatus.PENDING,
};

/**
 * Mock Milestone insert data (frontend - camelCase)
 */
export const mockMilestoneInput = {
  projectId: "550e8400-e29b-41d4-a716-446655440201",
  name: "Phase 3: Testing",
  description: "Quality assurance and testing",
  startDate: "2024-04-21",
  finishDate: "2024-05-20",
  status: MilestoneStatus.PENDING,
};

/**
 * Mock Milestone update data (database - snake_case)
 */
export const mockMilestoneUpdate: DbMilestoneUpdate = {
  status: MilestoneStatus.COMPLETED,
  completion_date: "2024-05-15",
  remarks: "Completed successfully",
  updated_at: new Date().toISOString(),
};

/**
 * Mock Milestone update data (frontend - camelCase)
 */
export const mockMilestoneUpdateInput = {
  status: MilestoneStatus.COMPLETED,
  completionDate: "2024-05-15",
  remarks: "Completed successfully",
};
