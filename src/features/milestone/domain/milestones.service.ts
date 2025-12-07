/* eslint-disable @typescript-eslint/no-explicit-any */
import { transformToDb, transformFromDb } from "@/shared/lib/api/api-utils";
import { milestoneSchema, updateMilestoneSchema } from "./schemas";
import * as milestonesRepository from "./milestones.repository";
import type { MilestoneQueryOptions } from "./milestones.repository";

/**
 * Business Logic Layer for Milestones
 */

export async function getMilestones(options: MilestoneQueryOptions) {
  const { data, error, count } = await milestonesRepository.findAll(options);

  if (error) {
    throw new Error(error.message);
  }

  // Transform milestone members to camelCase and filter soft-deleted
  const transformedData = (data || []).map((milestone: any) => {
    const transformed = transformFromDb(milestone) as any;
    if (milestone.milestone_members) {
      // Filter out soft-deleted members
      const activeMembers = milestone.milestone_members.filter(
        (member: any) => !member.deleted_at
      );
      transformed.members = activeMembers.map((member: any) => ({
        id: member.employees.id,
        name: member.employees.name,
        familyName: member.employees.family_name,
        role: member.role,
      }));
    }
    return transformed;
  });

  return {
    milestones: transformedData,
    count: count || 0,
  };
}

export async function getMilestoneById(id: string) {
  const { data, error } = await milestonesRepository.findById(id);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Milestone not found");
    }
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Milestone not found");
  }

  // Transform milestone members to camelCase and filter soft-deleted
  const transformed: any = transformFromDb(data);
  if ((data as any).milestone_members) {
    // Filter out soft-deleted members
    const activeMembers = (data as any).milestone_members.filter(
      (member: any) => !member.deleted_at
    );
    transformed.members = activeMembers.map((member: any) => ({
      id: member.employees.id,
      name: member.employees.name,
      familyName: member.employees.family_name,
      role: member.role,
    }));
  }

  return transformed;
}

export async function createMilestone(input: unknown) {
  const validatedData = milestoneSchema.parse(input);
  const dbData = transformToDb(validatedData);

  const { data, error } = await milestonesRepository.create(dbData);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to create milestone");
  }

  return transformFromDb(data);
}

export async function updateMilestone(id: string, input: unknown) {
  const validatedData = updateMilestoneSchema.parse(input);
  const dbData = transformToDb(validatedData);

  const { data, error } = await milestonesRepository.update(id, dbData);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Milestone not found");
    }
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Milestone not found");
  }

  return transformFromDb(data);
}

export async function deleteMilestone(id: string) {
  const { error } = await milestonesRepository.deleteMilestone(id);

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("Milestone not found");
    }
    throw new Error(error.message);
  }
}
