"use client";

import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";
import { MilestoneInput } from "@/features/milestone/services/schemas";

interface AddMilestoneRemarksFieldProps {
  register: UseFormRegister<MilestoneInput>;
}

export function AddMilestoneRemarksField({
  register,
}: AddMilestoneRemarksFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="remarks">Remarks (Optional)</Label>
      <Textarea
        id="remarks"
        placeholder="Any additional notes or comments"
        rows={2}
        {...register("remarks")}
      />
    </div>
  );
}
