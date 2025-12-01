/* eslint-disable @typescript-eslint/no-explicit-any */
import { transformToDb, transformFromDb } from "@/lib/api/api-utils";
import { companySchema, updateCompanySchema } from "./schemas";
import * as companyRepository from "./repository";
import type { CompanyQueryOptions } from "./repository";

/**
 * Business Logic Layer for Companies
 */

export async function getCompanies(options: CompanyQueryOptions) {
  const { data, error, count } = await companyRepository.findAll(options);

  if (error) {
    throw new Error(error.message);
  }

  return {
    companies: transformFromDb<unknown[]>(data || []),
    count: count || 0,
  };
}

export async function getCompanyById(id: string) {
  const { data, error } = await companyRepository.findById(id);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Company not found");
    }
    throw new Error(error.message);
  }

  return transformFromDb(data);
}

export async function createCompany(input: unknown) {
  const validatedData = companySchema.parse(input);
  const dbData = transformToDb(validatedData);

  const { data, error } = await companyRepository.create(dbData);

  if (error) {
    throw new Error(error.message);
  }

  return transformFromDb(data);
}

export async function updateCompany(id: string, input: unknown) {
  const validatedData = updateCompanySchema.parse(input);
  const dbData = transformToDb(validatedData);

  const { data, error } = await companyRepository.update(id, dbData);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Company not found");
    }
    throw new Error(error.message);
  }

  return transformFromDb(data);
}

export async function deleteCompany(id: string) {
  const { error } = await companyRepository.deleteCompany(id);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Company not found");
    }
    throw new Error(error.message);
  }

  return { success: true };
}
