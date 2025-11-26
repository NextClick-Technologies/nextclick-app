/**
 * Project type (frontend - camelCase)
 * Represents the data structure AFTER transformation by transformFromDb()
 */

// Payment Terms enum values
export const PaymentTerms = {
  NET_30D: "net_30d",
  NET_60D: "net_60d",
  NET_90D: "net_90d",
  IMMEDIATE: "immediate",
} as const;
export type PaymentTerms = (typeof PaymentTerms)[keyof typeof PaymentTerms];

// Project Status enum values
export const ProjectStatus = {
  ACTIVE: "active",
  COMPLETED: "completed",
  ON_HOLD: "on_hold",
  CANCELLED: "cancelled",
} as const;
export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus];

// Project Priority enum values
export const ProjectPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;
export type ProjectPriority =
  (typeof ProjectPriority)[keyof typeof ProjectPriority];

export interface Project {
  id: string;
  name: string;
  type: string;
  startDate: string | null;
  finishDate: string | null;
  budget: string;
  paymentTerms: PaymentTerms;
  status: ProjectStatus;
  priority: ProjectPriority;
  description: string;
  completionDate: string | null;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}
