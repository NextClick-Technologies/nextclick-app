/* eslint-disable @typescript-eslint/no-explicit-any */
import { transformToDb, transformFromDb } from "@/lib/api/api-utils";
import { updateEmployeeSchema } from "./schemas";
import * as employeeRepository from "./repository";
import type { EmployeeQueryOptions } from "./repository";

/**
 * Business Logic Layer for Employees
 */

export async function getEmployees(options: EmployeeQueryOptions) {
  const { data, error, count } = await employeeRepository.findAll(options);

  if (error) {
    throw new Error(error.message);
  }

  return {
    employees: transformFromDb<unknown[]>(data || []),
    count: count || 0,
  };
}

export async function getEmployeeById(id: string) {
  const { data, error } = await employeeRepository.findById(id);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Employee not found");
    }
    throw new Error(error.message);
  }

  return transformFromDb(data);
}

export async function createEmployee(input: unknown) {
  // Data is already validated and transformed on frontend
  const { data, error } = await employeeRepository.create(input as any);

  if (error) {
    throw new Error(error.message);
  }

  return transformFromDb(data);
}

export async function updateEmployee(id: string, input: unknown) {
  const validatedData = updateEmployeeSchema.parse(input);
  const dbData = transformToDb(validatedData);

  const { data, error } = await employeeRepository.update(id, dbData);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Employee not found");
    }
    throw new Error(error.message);
  }

  return transformFromDb(data);
}

export async function deleteEmployee(id: string) {
  const { error } = await employeeRepository.deleteEmployee(id);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Employee not found");
    }
    throw new Error(error.message);
  }

  return { success: true };
}
