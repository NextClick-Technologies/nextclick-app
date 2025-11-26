"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  updateMilestoneSchema,
  type UpdateMilestoneInput,
} from "@/schemas/milestone.schema";
import { useUpdateMilestone } from "@/hooks/useMilestone";
import { Milestone } from "@/types/milestone.type";
import { toast } from "sonner";

interface EditMilestoneDialogProps {
  milestone: Milestone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Format date for input field (YYYY-MM-DD)
const formatDateForInput = (dateString: string | null | undefined) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

export function EditMilestoneDialog({
  milestone,
  open,
  onOpenChange,
}: EditMilestoneDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateMilestone = useUpdateMilestone();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UpdateMilestoneInput>({
    resolver: zodResolver(updateMilestoneSchema),
  });

  const status = watch("status");

  // Populate form when milestone changes
  useEffect(() => {
    if (milestone) {
      reset({
        name: milestone.name,
        description: milestone.description,
        startDate: formatDateForInput(milestone.startDate),
        finishDate: formatDateForInput(milestone.finishDate),
        completionDate: formatDateForInput(milestone.completionDate),
        status: milestone.status,
        remarks: milestone.remarks || "",
        projectId: milestone.projectId,
      });
    }
  }, [milestone, reset]);

  const onSubmit = async (data: UpdateMilestoneInput) => {
    if (!milestone) return;

    setIsSubmitting(true);
    try {
      // Clean up empty strings to null for optional date fields
      const cleanedData = {
        ...data,
        completionDate: data.completionDate || null,
        remarks: data.remarks || null,
      };

      await updateMilestone.mutateAsync({
        id: milestone.id,
        data: cleanedData,
      });
      toast.success("Milestone updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update milestone");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  if (!milestone) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Milestone</DialogTitle>
          <DialogDescription>
            Update milestone details and progress
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          {/* Dates */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-startDate">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-startDate"
                type="date"
                {...register("startDate")}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-finishDate">
                Target Finish Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-finishDate"
                type="date"
                {...register("finishDate")}
              />
              {errors.finishDate && (
                <p className="text-sm text-destructive">
                  {errors.finishDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setValue("status", value as UpdateMilestoneInput["status"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Completion Date (only for completed status) */}
          {status === "completed" && (
            <div className="space-y-2">
              <Label htmlFor="edit-completionDate">Completion Date</Label>
              <Input
                id="edit-completionDate"
                type="date"
                {...register("completionDate")}
              />
            </div>
          )}

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="edit-remarks">Remarks (Optional)</Label>
            <Textarea
              id="edit-remarks"
              placeholder="Any additional notes or comments"
              rows={2}
              {...register("remarks")}
            />
          </div>

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
              {isSubmitting ? "Updating..." : "Update Milestone"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
