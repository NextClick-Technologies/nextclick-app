/* eslint-disable @typescript-eslint/no-explicit-any */
import { transformToDb, transformFromDb } from "@/lib/api/api-utils";
import { projectSchema, updateProjectSchema } from "./schemas";
import * as projectRepository from "./repository";
import type { ProjectQueryOptions } from "./repository";

/**
 * Business Logic Layer for Projects
 */

export async function getProjects(options: ProjectQueryOptions) {
  const { data, error, count } = await projectRepository.findAll(options);

  if (error) {
    throw new Error(error.message);
  }

  return {
    projects: transformFromDb<unknown[]>(data || []),
    count: count || 0,
  };
}

export async function getProjectById(id: string) {
  const { data, error } = await projectRepository.findById(id);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Project not found");
    }
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Project not found");
  }

  // Transform project_members array if it exists
  const baseData = transformFromDb(data) as Record<string, any>;
  return {
    ...baseData,
    members: (data as any).project_members
      ?.map((pm: any) => {
        const employee = pm.users?.employees?.[0];
        return employee
          ? {
              id: employee.id,
              name: employee.name,
              familyName: employee.family_name,
              role: pm.role,
            }
          : null;
      })
      .filter(Boolean),
  };
}

export async function createProject(input: unknown) {
  const validatedData = projectSchema.parse(input);
  const dbData = transformToDb(validatedData);

  const { data, error } = await projectRepository.create(dbData);

  if (error) {
    throw new Error(error.message);
  }

  return transformFromDb(data);
}

export async function updateProject(id: string, input: unknown) {
  const validatedData = updateProjectSchema.parse(input);
  const dbData = transformToDb(validatedData);

  const { data, error } = await projectRepository.update(id, dbData);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Project not found");
    }
    throw new Error(error.message);
  }

  return transformFromDb(data);
}

export async function deleteProject(id: string) {
  const { error } = await projectRepository.deleteProject(id);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Project not found");
    }
    throw new Error(error.message);
  }

  return { success: true };
}
