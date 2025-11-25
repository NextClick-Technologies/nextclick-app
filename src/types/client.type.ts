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

export interface Client {
  id: string;
  name: string;
  title: Title | null;
  familyName: string;
  gender: Gender;
  phoneNumber: string;
  email: string;
  totalContractValue: number | null;
  joinDate: string | null;
  companyId: string | null;
  createdAt: string;
  updatedAt: string;
}
