/**
 * Milestone type (frontend - camelCase)
 * Represents the data structure AFTER transformation by transformFromDb()
 */

// Milestone Status enum values
export const MilestoneStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;
export type MilestoneStatus =
  (typeof MilestoneStatus)[keyof typeof MilestoneStatus];

export interface Milestone {
  id: string;
  projectId: string;
  name: string;
  description: string;
  startDate: string;
  finishDate: string;
  completionDate: string | null;
  status: MilestoneStatus;
  remarks: string | null;
  order?: number;
  createdAt: string;
  updatedAt: string;
}
