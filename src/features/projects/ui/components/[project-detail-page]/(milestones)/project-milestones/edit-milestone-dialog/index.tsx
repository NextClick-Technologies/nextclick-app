"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Milestone } from "@/features/milestone/domain/types";
import { UpdateMilestoneInput } from "@/features/milestone/domain/schemas";
import { useEditMilestoneForm } from "./useEditMilestoneForm";
import { MilestoneBasicFields } from "./MilestoneBasicFields";
import { MilestoneDateFields } from "./MilestoneDateFields";
import { MilestoneStatusField } from "./MilestoneStatusField";
import { MilestoneRemarksField } from "./MilestoneRemarksField";

interface EditMilestoneDialogProps {
  milestone: Milestone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMilestoneDialog({
  milestone,
  open,
  onOpenChange,
}: EditMilestoneDialogProps) {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    status,
    isSubmitting,
    onSubmit,
    handleClose,
  } = useEditMilestoneForm(milestone, onOpenChange);

  if (!milestone) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl sm:mx-8 sm:my-8 flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Milestone</DialogTitle>
          <DialogDescription>
            Update milestone details and progress
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            <MilestoneBasicFields register={register} errors={errors} />

            <MilestoneDateFields
              register={register}
              errors={errors}
              showCompletionDate={status === "completed"}
            />

            <MilestoneStatusField
              status={status}
              onStatusChange={(value) =>
                setValue("status", value as UpdateMilestoneInput["status"])
              }
            />

            <MilestoneRemarksField register={register} />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Milestone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
