"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";
import { MilestoneInput } from "@/schemas/milestone.schema";

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
