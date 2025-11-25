/**
 * Company type (frontend - camelCase)
 * Represents the data structure AFTER transformation by transformFromDb()
 */

export interface Company {
  id: string;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  contactPerson: string | null;
  industry: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}
