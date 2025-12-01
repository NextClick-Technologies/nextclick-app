import { Company } from "@/features/companies/services/types/company.type";
import type {
  Company as DbCompany,
  CompanyInsert as DbCompanyInsert,
  CompanyUpdate as DbCompanyUpdate,
} from "@/shared/types/database.type";

/**
 * Mock Company data (frontend - camelCase)
 */
export const mockCompany: Company = {
  id: "550e8400-e29b-41d4-a716-446655440101",
  name: "Acme Corporation",
  email: "contact@acme.com",
  address: "123 Business St, Suite 100, New York, NY 10001",
  phoneNumber: "+1234567800",
  contactPerson: "Alice Williams",
  industry: "Technology",
  status: "active",
  createdAt: "2024-01-01T10:00:00.000Z",
  updatedAt: "2024-01-01T10:00:00.000Z",
};

export const mockCompany2: Company = {
  id: "550e8400-e29b-41d4-a716-446655440102",
  name: "TechStart Inc",
  email: "info@techstart.com",
  address: "456 Startup Ave, San Francisco, CA 94102",
  phoneNumber: "+1234567801",
  contactPerson: "Bob Chen",
  industry: "Software",
  status: "active",
  createdAt: "2024-01-05T10:00:00.000Z",
  updatedAt: "2024-01-05T10:00:00.000Z",
};

export const mockCompanies: Company[] = [mockCompany, mockCompany2];

/**
 * Mock Company data (database - snake_case)
 */
export const mockDbCompany: DbCompany = {
  id: "550e8400-e29b-41d4-a716-446655440101",
  name: "Acme Corporation",
  email: "contact@acme.com",
  address: "123 Business St, Suite 100, New York, NY 10001",
  phone_number: "+1234567800",
  contact_person: "Alice Williams",
  industry: "Technology",
  status: "active",
  created_at: "2024-01-01T10:00:00.000Z",
  updated_at: "2024-01-01T10:00:00.000Z",
};

export const mockDbCompanies: DbCompany[] = [
  mockDbCompany,
  {
    id: "550e8400-e29b-41d4-a716-446655440102",
    name: "TechStart Inc",
    email: "info@techstart.com",
    address: "456 Startup Ave, San Francisco, CA 94102",
    phone_number: "+1234567801",
    contact_person: "Bob Chen",
    industry: "Software",
    status: "active",
    created_at: "2024-01-05T10:00:00.000Z",
    updated_at: "2024-01-05T10:00:00.000Z",
  },
];

/**
 * Mock Company insert data
 */
export const mockCompanyInsert: DbCompanyInsert = {
  name: "Global Enterprises",
  email: "contact@global.com",
  address: "789 Enterprise Blvd, Boston, MA 02108",
  phone_number: "+1234567802",
  contact_person: "Carol Davis",
  industry: "Manufacturing",
  status: "active",
};

/**
 * Mock Company update data
 */
export const mockCompanyUpdate: DbCompanyUpdate = {
  contact_person: "David Brown",
  phone_number: "+1234567803",
  updated_at: new Date().toISOString(),
};

/**
 * Mock Company form input (camelCase)
 */
export const mockCompanyInput = {
  name: "Global Enterprises",
  email: "contact@global.com",
  address: "789 Enterprise Blvd, Boston, MA 02108",
  phoneNumber: "+1234567802",
  contactPerson: "Carol Davis",
  industry: "Manufacturing",
  status: "active",
};
