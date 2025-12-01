import type { Client, Company, Project, Employee } from "@/shared/types";
import {
  Title,
  Gender,
  ClientStatus,
} from "@/features/clients/domain/types/client.type";
import {
  ProjectStatus,
  PaymentTerms,
  ProjectPriority,
} from "@/features/projects/domain/types/project.type";
import { EmployeeStatus } from "@/features/employees/domain/types/employee.type";

/**
 * E2E test data generators
 */

export const createTestClient = (
  overrides?: Partial<Client>
): Omit<Client, "id" | "createdAt" | "updatedAt"> => ({
  name: `Test${Date.now()}`,
  title: Title.MR,
  familyName: `Client`,
  gender: Gender.MALE,
  phoneNumber: "555-0100",
  email: `client-${Date.now()}@example.com`,
  totalContractValue: null,
  joinDate: null,
  companyId: `company-${Date.now()}`,
  status: ClientStatus.ACTIVE,
  ...overrides,
});

export const createTestCompany = (
  overrides?: Partial<Company>
): Omit<Company, "id" | "createdAt" | "updatedAt"> => ({
  name: `Test Company ${Date.now()}`,
  email: `company-${Date.now()}@example.com`,
  address: "123 Test St, Test City, TS 12345",
  phoneNumber: "555-0300",
  contactPerson: "Test Contact",
  industry: "Technology",
  status: "active",
  ...overrides,
});

export const createTestProject = (
  clientId: string,
  overrides?: Partial<Project>
): Omit<Project, "id" | "createdAt" | "updatedAt"> => ({
  name: `Test Project ${Date.now()}`,
  type: "Web Development",
  description: "E2E test project",
  clientId,
  status: ProjectStatus.ACTIVE,
  priority: ProjectPriority.MEDIUM,
  startDate: new Date().toISOString(),
  finishDate: null,
  budget: "10000",
  paymentTerms: PaymentTerms.NET_30D,
  completionDate: null,
  projectManager: null,
  ...overrides,
});

export const createTestEmployee = (
  overrides?: Partial<Employee>
): Omit<Employee, "id" | "createdAt" | "updatedAt"> => ({
  title: Title.MR,
  name: "Test",
  familyName: `User${Date.now()}`,
  preferredName: null,
  gender: Gender.MALE,
  phoneNumber: "555-0200",
  email: `employee-${Date.now()}@example.com`,
  photo: null,
  userId: null,
  position: "Developer",
  department: "Engineering",
  status: EmployeeStatus.ACTIVE,
  joinDate: new Date().toISOString(),
  salary: 75000,
  emergencyContact: null,
  emergencyPhone: null,
  address: null,
  city: null,
  state: null,
  zipCode: null,
  country: null,
  ...overrides,
});

/**
 * Wait for API response helper
 */
export const waitForApiResponse = async (
  page: any,
  urlPattern: string | RegExp,
  timeout = 5000
) => {
  return page.waitForResponse(
    (response: any) => {
      const url = response.url();
      if (typeof urlPattern === "string") {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout }
  );
};
