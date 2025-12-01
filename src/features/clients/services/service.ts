/* eslint-disable @typescript-eslint/no-explicit-any */
import { transformToDb, transformFromDb } from "@/shared/lib/api/api-utils";
import { clientSchema, updateClientSchema } from "./schemas/client.schema";
import * as clientRepository from "./repository";
import type { ClientQueryOptions } from "./repository";

/**
 * Business Logic Layer for Clients
 * Contains domain logic and orchestrates repository calls
 */

/**
 * Get paginated list of clients with related data
 */
export async function getClients(options: ClientQueryOptions) {
  // Fetch clients
  const { data, error, count } = await clientRepository.findAll(options);

  if (error) {
    throw new Error(error.message);
  }

  // Extract unique company IDs
  const companyIds = [
    ...new Set(
      (data as any[])?.map((client: any) => client.company_id).filter(Boolean)
    ),
  ];

  // Extract client IDs
  const clientIds = (data as any[])?.map((client: any) => client.id) || [];

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
    clients: transformFromDb<unknown[]>(data || []),
    count: count || 0,
    metadata: {
      companies: transformFromDb(companies),
      projectCounts,
    },
  };
}

/**
 * Get single client by ID
 */
export async function getClientById(id: string) {
  const { data, error } = await clientRepository.findById(id, {
    includeCompany: true,
  });

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Client not found");
    }
    throw new Error(error.message);
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
