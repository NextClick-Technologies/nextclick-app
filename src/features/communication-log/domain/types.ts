/**
 * Communication Log type (frontend - camelCase)
 * Represents the data structure AFTER transformation by transformFromDb()
 */

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

export interface CommunicationLog {
  id: string;
  clientId: string;
  projectId: string | null;
  employeeId: string;
  communicationDate: string;
  channel: CommunicationChannel;
  subject: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
