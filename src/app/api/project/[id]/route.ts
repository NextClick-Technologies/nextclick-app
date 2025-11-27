import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import {
  apiSuccess,
  apiError,
  handleApiError,
  transformToDb,
  transformFromDb,
} from "@/lib/api/api-utils";
import { updateProjectSchema } from "@/schemas/project.schema";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data, error } = await supabaseAdmin
      .from("projects")
      .select(
        "*, client:clients(id, name, family_name), employee:employees(id, name, family_name), project_members(id, role, member:employees(id, name, family_name))"
      )
      .eq("id", id)
      .single();

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    if (!data) {
      return apiError("Project not found", 404);
    }

    // Transform project_members array if it exists
    const baseData = transformFromDb(data) as Record<string, any>;
    const transformedData = {
      ...baseData,
      members: (data as any).project_members?.map((pm: any) => ({
        id: pm.member.id,
        name: pm.member.name,
        familyName: pm.member.family_name,
        role: pm.role,
      })),
    };

    return apiSuccess({ data: transformedData });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = updateProjectSchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("projects")
      // @ts-expect-error - Supabase type inference issue with partial updates
      .update({
        ...transformToDb(validatedData),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    return apiSuccess({ data: transformFromDb(data) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { error } = await supabaseAdmin
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    return apiSuccess({ message: "Project deleted successfully" }, 204);
  } catch (error) {
    return handleApiError(error);
  }
}
