"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UseFormRegister } from "react-hook-form";
import { UpdateMilestoneInput } from "@/schemas/milestone.schema";

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
