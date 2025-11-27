import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateMilestone } from "@/hooks/useMilestone";
import { Milestone } from "@/types/milestone.type";
import {
  updateMilestoneSchema,
  type UpdateMilestoneInput,
} from "@/schemas/milestone.schema";
import { toast } from "sonner";
import { formatDateForInput, cleanMilestoneData } from "./MilestoneFormUtils";

export function useEditMilestoneForm(
  milestone: Milestone | null,
  onOpenChange: (open: boolean) => void
) {
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
      const cleanedData = cleanMilestoneData(data);

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

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    status,
    isSubmitting,
    onSubmit,
    handleClose,
  };
}
