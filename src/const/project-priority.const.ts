// Project Priority enum values
export const ProjectPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const;
export type ProjectPriority =
  (typeof ProjectPriority)[keyof typeof ProjectPriority];
