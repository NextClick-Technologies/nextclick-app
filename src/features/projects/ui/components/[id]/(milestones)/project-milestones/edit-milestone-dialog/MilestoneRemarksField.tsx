"use client";

import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";
import { UpdateMilestoneInput } from "@/features/milestone/domain/schemas";

interface MilestoneRemarksFieldProps {
  register: UseFormRegister<UpdateMilestoneInput>;
}

export function MilestoneRemarksField({
  register,
}: MilestoneRemarksFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="edit-remarks">Remarks (Optional)</Label>
      <Textarea
        id="edit-remarks"
        placeholder="Any additional notes or comments"
        rows={2}
        {...register("remarks")}
      />
    </div>
  );
}
