/* eslint-disable @typescript-eslint/no-explicit-any */
import { transformToDb, transformFromDb } from "@/shared/lib/api/api-utils";
import { clientSchema, updateClientSchema } from "./schemas";
import * as clientRepository from "./repositories";
import type { ClientQueryOptions } from "./repositories";
import type { UserRole } from "@/shared/types/auth.types";

/**
 * Business Logic Layer for Clients
 * Contains domain logic and orchestrates repository calls
 */

/**
 * Get paginated list of clients with related data
 * Applies role-based filtering for employees
 */
export async function getClients(
  options: ClientQueryOptions,
  userId: string,
  userRole: UserRole
) {
  // For employees, we need to filter clients by their assigned projects
  // For now, let's allow all roles to see all clients (managers/viewers need it)
  // Employees will be filtered at the UI level or we can add filtering here

  // Fetch clients
  const { data, error, count } = await clientRepository.findAll(options);

  if (error) {
    throw new Error(error.message);
  }

  // For employees, filter clients that have projects they're assigned to
  let filteredData: any[] = data || [];
  if (userRole === "employee") {
    // Get client IDs accessible to this employee (via materialized view)
    const assignedClientIds = await clientRepository.getEmployeeClientIds(
      userId
    );
    const clientIdSet = new Set(assignedClientIds);

    // Filter clients to only those with assigned projects
    filteredData =
      (data as any[])?.filter((client: any) => clientIdSet.has(client.id)) ||
      [];
  }

  // Extract unique company IDs
  const companyIds = [
    ...new Set(
      (filteredData as any[])
        ?.map((client: any) => client.company_id)
        .filter(Boolean)
    ),
  ];

  // Extract client IDs
  const clientIds =
    (filteredData as any[])?.map((client: any) => client.id) || [];

  // Fetch companies and project counts in parallel
  const [companiesResult, projectsResult] = await Promise.all([
    clientRepository.findCompaniesByIds(companyIds),
    clientRepository.countProjectsByClientIds(clientIds),
  ]);

  // Process companies
  const companies = companiesResult.data || [];

  // Process project counts
  const countsMap = ((projectsResult.data as any[]) || []).reduce(
    (acc: Record<string, number>, project: any) => {
      acc[project.client_id] = (acc[project.client_id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const projectCounts = Object.entries(countsMap).map(([clientId, count]) => ({
    clientId,
    count,
  }));

  return {
    clients: transformFromDb<unknown[]>(filteredData || []),
    count: userRole === "employee" ? filteredData?.length || 0 : count || 0,
    metadata: {
      companies: transformFromDb(companies),
      projectCounts,
    },
  };
}

/**
 * Get single client by ID
 * Checks employee access to client via projects
 */
export async function getClientById(
  id: string,
  userId: string,
  userRole: UserRole
) {
  const { data, error } = await clientRepository.findById(id, {
    includeCompany: true,
  });

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Client not found");
    }
    throw new Error(error.message);
  }

  // For employees, check if they have access to this client (via materialized view)
  if (userRole === "employee") {
    const assignedClientIds = await clientRepository.getEmployeeClientIds(
      userId
    );
    const hasAccess = assignedClientIds.includes(id);

    if (!hasAccess) {
      throw new Error("Client not found"); // Don't reveal it exists
    }
  }

  return transformFromDb(data);
}

/**
 * Create a new client
 */
export async function createClient(input: unknown) {
  // Validate input
  const validatedData = clientSchema.parse(input);

  // Transform to database format
  const dbData = transformToDb(validatedData);

  // Create in database
  const { data, error } = await clientRepository.create(dbData);

  if (error) {
    throw new Error(error.message);
  }

  return transformFromDb(data);
}

/**
 * Update existing client
 */
export async function updateClient(id: string, input: unknown) {
  // Validate input
  const validatedData = updateClientSchema.parse(input);

  // Transform to database format
  const dbData = transformToDb(validatedData);

  // Update in database
  const { data, error } = await clientRepository.update(id, dbData);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Client not found");
    }
    throw new Error(error.message);
  }

  return transformFromDb(data);
}

/**
 * Delete client
 */
export async function deleteClient(id: string) {
  const { error } = await clientRepository.deleteClient(id);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Client not found");
    }
    throw new Error(error.message);
  }

  return { success: true };
}
