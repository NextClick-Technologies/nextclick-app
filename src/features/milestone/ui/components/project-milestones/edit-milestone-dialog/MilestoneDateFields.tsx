"use client";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UpdateMilestoneInput } from "@/features/milestone/domain/schemas";

interface MilestoneDateFieldsProps {
  register: UseFormRegister<UpdateMilestoneInput>;
  errors: FieldErrors<UpdateMilestoneInput>;
  showCompletionDate?: boolean;
}

export function MilestoneDateFields({
  register,
  errors,
  showCompletionDate,
}: MilestoneDateFieldsProps) {
  return (
    <>
      {/* Start and Finish Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="edit-startDate">Start Date</Label>
          <Input id="edit-startDate" type="date" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-sm text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit-finishDate">Target Finish Date</Label>
          <Input id="edit-finishDate" type="date" {...register("finishDate")} />
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
          <Label htmlFor="edit-completionDate">Completion Date</Label>
          <Input
            id="edit-completionDate"
            type="date"
            {...register("completionDate")}
          />
        </div>
      )}
    </>
  );
}
