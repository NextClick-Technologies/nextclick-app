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
