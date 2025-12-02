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
import { useAddMilestoneForm } from "./useAddMilestoneForm";
import { AddMilestoneBasicFields } from "./AddMilestoneBasicFields";
import { AddMilestoneDateFields } from "./AddMilestoneDateFields";
import { AddMilestoneStatusField } from "./AddMilestoneStatusField";
import { AddMilestoneRemarksField } from "./AddMilestoneRemarksField";
import { type MilestoneInput } from "@/features/milestone/domain/schemas";

interface AddMilestoneDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMilestoneDialog({
  projectId,
  open,
  onOpenChange,
}: AddMilestoneDialogProps) {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    status,
    isSubmitting,
    onSubmit,
    handleClose,
  } = useAddMilestoneForm(projectId, onOpenChange);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Milestone</DialogTitle>
          <DialogDescription>
            Create a new milestone to track project progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AddMilestoneBasicFields register={register} errors={errors} />

          <AddMilestoneDateFields
            register={register}
            errors={errors}
            showCompletionDate={status === "completed"}
          />

          <AddMilestoneStatusField
            status={status}
            onStatusChange={(value) =>
              setValue("status", value as MilestoneInput["status"])
            }
          />

          <AddMilestoneRemarksField register={register} />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Milestone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
