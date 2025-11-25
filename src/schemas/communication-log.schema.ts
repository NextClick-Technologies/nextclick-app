import { z } from "zod";

export const communicationLogSchema = z.object({
  date: z.string().datetime(),
  channel: z.enum(["email", "phone", "chat", "meeting", "video_call"]),
  summary: z.string().min(1, "Summary is required"),
  followUpRequired: z.boolean(),
  followUpDate: z.string().datetime().optional().nullable(),
  clientId: z.string().min(1, "Client ID is required"),
  employeeId: z.string().min(1, "Employee ID is required"),
});

export const updateCommunicationLogSchema = communicationLogSchema.partial();

export type CommunicationLogInput = z.infer<typeof communicationLogSchema>;
export type UpdateCommunicationLogInput = z.infer<typeof updateCommunicationLogSchema>;
