import {
  CommunicationLog,
  CommunicationChannel,
} from "@/features/communication-log/services/types/communication-log.type";
import type {
  CommunicationLog as DbCommunicationLog,
  CommunicationLogInsert as DbCommunicationLogInsert,
  CommunicationLogUpdate as DbCommunicationLogUpdate,
} from "@/shared/types/database.type";

/**
 * Mock Communication Log data (frontend - camelCase)
 */
export const mockCommunicationLog: CommunicationLog = {
  id: "550e8400-e29b-41d4-a716-446655440601",
  clientId: "550e8400-e29b-41d4-a716-446655440001",
  projectId: "550e8400-e29b-41d4-a716-446655440201",
  employeeId: "550e8400-e29b-41d4-a716-446655440301",
  communicationDate: "2024-02-10",
  channel: CommunicationChannel.EMAIL,
  subject: "Project kickoff meeting",
  notes: "Discussed project timeline and deliverables",
  createdAt: "2024-02-10T10:00:00.000Z",
  updatedAt: "2024-02-10T10:00:00.000Z",
};

export const mockCommunicationLog2: CommunicationLog = {
  id: "550e8400-e29b-41d4-a716-446655440602",
  clientId: "550e8400-e29b-41d4-a716-446655440001",
  projectId: "550e8400-e29b-41d4-a716-446655440201",
  employeeId: "550e8400-e29b-41d4-a716-446655440301",
  communicationDate: "2024-02-15",
  channel: CommunicationChannel.VIDEO_CALL,
  subject: "Progress update",
  notes: "Reviewed milestone 1 completion",
  createdAt: "2024-02-15T10:00:00.000Z",
  updatedAt: "2024-02-15T10:00:00.000Z",
};

export const mockCommunicationLogs: CommunicationLog[] = [
  mockCommunicationLog,
  mockCommunicationLog2,
];

/**
 * Mock Communication Log data (database - snake_case)
 */
export const mockDbCommunicationLog: DbCommunicationLog = {
  id: "550e8400-e29b-41d4-a716-446655440601",
  client_id: "550e8400-e29b-41d4-a716-446655440001",
  employee_id: "550e8400-e29b-41d4-a716-446655440301",
  date: "2024-02-10",
  channel: CommunicationChannel.EMAIL,
  summary:
    "Project kickoff meeting - Discussed project timeline and deliverables",
  follow_up_required: false,
  follow_up_date: null,
  created_at: "2024-02-10T10:00:00.000Z",
  updated_at: "2024-02-10T10:00:00.000Z",
};

/**
 * Mock Communication Log insert data
 */
export const mockCommunicationLogInsert: DbCommunicationLogInsert = {
  client_id: "550e8400-e29b-41d4-a716-446655440001",
  employee_id: "550e8400-e29b-41d4-a716-446655440301",
  date: "2024-03-01",
  channel: CommunicationChannel.MEETING,
  summary:
    "Requirements clarification - Clarified scope and requirements with client",
  follow_up_required: false,
};

/**
 * Mock Communication Log update data
 */
export const mockCommunicationLogUpdate: DbCommunicationLogUpdate = {
  summary: "Updated summary after meeting review",
  updated_at: new Date().toISOString(),
};
