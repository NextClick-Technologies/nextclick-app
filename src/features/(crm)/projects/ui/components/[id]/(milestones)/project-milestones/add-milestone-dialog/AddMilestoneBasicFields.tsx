"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { MilestoneInput } from "@/schemas/milestone.schema";

interface AddMilestoneBasicFieldsProps {
  register: UseFormRegister<MilestoneInput>;
  errors: FieldErrors<MilestoneInput>;
}

export function AddMilestoneBasicFields({
  register,
  errors,
}: AddMilestoneBasicFieldsProps) {
  return (
    <>
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Milestone Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="e.g., Project Planning, Backend Development"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
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
