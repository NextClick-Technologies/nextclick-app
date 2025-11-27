/**
 * Client type (frontend - camelCase)
 * Represents the data structure AFTER transformation by transformFromDb()
 */

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

// Client Status enum values
export const ClientStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
} as const;
export type ClientStatus = (typeof ClientStatus)[keyof typeof ClientStatus];

// Employee Status enum values
export const EmployeeStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ON_LEAVE: "on_leave",
  TERMINATED: "terminated",
} as const;
export type EmployeeStatus =
  (typeof EmployeeStatus)[keyof typeof EmployeeStatus];

export interface Client {
  id: string;
  name: string;
  title: Title;
  familyName: string;
  gender: Gender;
  phoneNumber: string;
  email: string;
  totalContractValue: number | null;
  joinDate: string | null;
  companyId: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
  };
}
