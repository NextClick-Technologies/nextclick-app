/**
 * Employee type (frontend - camelCase)
 * Represents the data structure AFTER transformation by transformFromDb()
 */

import type { Title, Gender } from "./client.type";

// Employee Status enum values
export const EmployeeStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ON_LEAVE: "on_leave",
  TERMINATED: "terminated",
} as const;
export type EmployeeStatus =
  (typeof EmployeeStatus)[keyof typeof EmployeeStatus];

export interface Employee {
  id: string;
  title: Title | null;
  name: string;
  familyName: string;
  preferredName: string | null;
  gender: Gender;
  phoneNumber: string;
  email: string;
  photo: string | null;
  userId: string | null;
  status: EmployeeStatus;
  // Additional fields for future scalability
  department: string | null;
  position: string | null;
  joinDate: string | null;
  salary: number | null;
  emergencyContact: string | null;
  emergencyPhone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}
