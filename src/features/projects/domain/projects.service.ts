/* eslint-disable @typescript-eslint/no-explicit-any */
import { transformToDb, transformFromDb } from "@/shared/lib/api/api-utils";
import { projectSchema, updateProjectSchema } from "./schemas";
import * as projectRepository from "./projects.repository";
import type { ProjectQueryOptions } from "./projects.repository";
import type { UserRole } from "@/shared/types/auth.types";

/**
 * Business Logic Layer for Projects
 */

export async function getProjects(
  options: ProjectQueryOptions,
  userId: string,
  userRole: UserRole
) {
  const { data, error, count } = await projectRepository.findAll(options);

  if (error) {
    throw new Error(error.message);
  }

  // For employees, filter to only their assigned projects (via materialized view)
  let filteredData: any[] = data || [];
  if (userRole === "employee") {
    const projectIds = await projectRepository.getEmployeeProjectIds(userId);
    const projectIdSet = new Set(projectIds);

    filteredData =
      (data as any[])?.filter((project: any) => projectIdSet.has(project.id)) ||
      [];
  }

  return {
    projects: transformFromDb<unknown[]>(filteredData || []),
    count: userRole === "employee" ? filteredData?.length || 0 : count || 0,
  };
}

export async function getProjectById(
  id: string,
  userId: string,
  userRole: UserRole
) {
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

  // For employees, check if they have access to this project (via materialized view)
  if (userRole === "employee") {
    const projectIds = await projectRepository.getEmployeeProjectIds(userId);
    const hasAccess = projectIds.includes(id);

    if (!hasAccess) {
      throw new Error("Project not found"); // Don't reveal it exists
    }
  }

  // Transform project_members array if it exists
  const baseData = transformFromDb(data) as Record<string, any>;
  return {
    ...baseData,
    members: (data as any).project_members
      ?.filter((pm: any) => !pm.deleted_at) // Filter out soft-deleted members
      ?.map((pm: any) => {
        const employee = pm.employees;
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
