"use client";

import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { UpdateMilestoneInput } from "@/features/milestone/domain/schemas";

interface MilestoneBasicFieldsProps {
  register: UseFormRegister<UpdateMilestoneInput>;
  errors: FieldErrors<UpdateMilestoneInput>;
}

export function MilestoneBasicFields({
  register,
  errors,
}: MilestoneBasicFieldsProps) {
  return (
    <>
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="edit-name">
          Milestone Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="edit-name"
          placeholder="e.g., Project Planning, Backend Development"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="edit-description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="edit-description"
          placeholder="Describe what needs to be accomplished in this milestone"
          rows={3}
          {...register("description")}
        />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>
    </>
  );
}
