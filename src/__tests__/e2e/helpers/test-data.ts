import type { Client, Company, Project, Employee } from "@/types";

/**
 * E2E test data generators
 */

export const createTestClient = (
  overrides?: Partial<Client>
): Omit<Client, "id" | "createdAt" | "updatedAt"> => ({
  name: `Test Client ${Date.now()}`,
  email: `client-${Date.now()}@example.com`,
  phone: "555-0100",
  companyId: null,
  status: "active",
  ...overrides,
});

export const createTestCompany = (
  overrides?: Partial<Company>
): Omit<Company, "id" | "createdAt" | "updatedAt"> => ({
  name: `Test Company ${Date.now()}`,
  website: `https://company-${Date.now()}.example.com`,
  industry: "Technology",
  size: "50-200",
  ...overrides,
});

export const createTestProject = (
  clientId: string,
  overrides?: Partial<Project>
): Omit<Project, "id" | "createdAt" | "updatedAt"> => ({
  name: `Test Project ${Date.now()}`,
  description: "E2E test project",
  clientId,
  status: "planning",
  startDate: new Date().toISOString(),
  budget: 10000,
  ...overrides,
});

export const createTestEmployee = (
  overrides?: Partial<Employee>
): Omit<Employee, "id" | "createdAt" | "updatedAt"> => ({
  firstName: "Test",
  lastName: `User ${Date.now()}`,
  email: `employee-${Date.now()}@example.com`,
  phone: "555-0200",
  position: "Developer",
  department: "Engineering",
  status: "active",
  salary: 75000,
  hireDate: new Date().toISOString(),
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
