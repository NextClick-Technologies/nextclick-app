"use client";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { MilestoneInput } from "@/features/milestone/domain/schemas";

interface AddMilestoneDateFieldsProps {
  register: UseFormRegister<MilestoneInput>;
  errors: FieldErrors<MilestoneInput>;
  showCompletionDate?: boolean;
}

export function AddMilestoneDateFields({
  register,
  errors,
  showCompletionDate,
}: AddMilestoneDateFieldsProps) {
  return (
    <>
      {/* Start and Finish Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="startDate">
            Start Date <span className="text-destructive">*</span>
          </Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-sm text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="finishDate">
            Target Finish Date <span className="text-destructive">*</span>
          </Label>
          <Input id="finishDate" type="date" {...register("finishDate")} />
          {errors.finishDate && (
            <p className="text-sm text-destructive">
              {errors.finishDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Completion Date (conditional) */}
      {showCompletionDate && (
        <div className="space-y-2">
          <Label htmlFor="completionDate">Completion Date</Label>
          <Input
            id="completionDate"
            type="date"
            {...register("completionDate")}
          />
        </div>
      )}
    </>
  );
}
