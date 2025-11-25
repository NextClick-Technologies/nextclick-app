import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { apiSuccess, apiError, handleApiError } from "@/lib/api/api-utils";
import { updateCompanySchema } from "@/schemas/company.schema";
import type { CompanyUpdate } from "@/types/database.type";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { data, error } = await supabaseAdmin
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = updateCompanySchema.parse(body);

    const { data, error } = await supabaseAdmin
      .from("companies")
      .update({
        ...validatedData,
        updatedAt: new Date().toISOString(),
      } as CompanyUpdate)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    return apiSuccess(data);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error } = await supabaseAdmin
      .from("companies")
      .delete()
      .eq("id", id);

    if (error) {
      return apiError(error.message, error.code === "PGRST116" ? 404 : 500);
    }

    return apiSuccess({ message: "Company deleted successfully" }, 204);
  } catch (error) {
    return handleApiError(error);
  }
}
