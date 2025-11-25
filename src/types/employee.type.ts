/**
 * Employee type (frontend - camelCase)
 * Represents the data structure AFTER transformation by transformFromDb()
 */

import type { Title, Gender } from "./client.type";

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
  createdAt: string;
  updatedAt: string;
}
