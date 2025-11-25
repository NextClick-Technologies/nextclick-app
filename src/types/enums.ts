// Title enum values
export const Title = {
  MR: "mr",
  MRS: "mrs",
  MS: "ms",
  DR: "dr",
  PROF: "prof",
  SR: "sr",
} as const;
export type Title = (typeof Title)[keyof typeof Title];

// Gender enum values
export const Gender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

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

// Milestone Status enum values
export const MilestoneStatus = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;
export type MilestoneStatus =
  (typeof MilestoneStatus)[keyof typeof MilestoneStatus];

// Payment Status enum values
export const PaymentStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

// Payment Method enum values
export const PaymentMethod = {
  CASH: "cash",
  BANK_TRANSFER: "bank_transfer",
  CREDIT_CARD: "credit_card",
  CHEQUE: "cheque",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

// Communication Channel enum values
export const CommunicationChannel = {
  EMAIL: "email",
  PHONE: "phone",
  CHAT: "chat",
  MEETING: "meeting",
  VIDEO_CALL: "video_call",
} as const;
export type CommunicationChannel =
  (typeof CommunicationChannel)[keyof typeof CommunicationChannel];
