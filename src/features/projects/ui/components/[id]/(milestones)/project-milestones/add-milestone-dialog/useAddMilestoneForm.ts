import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateMilestone } from "@/features/milestone/ui/hooks/useMilestone";
import {
  milestoneSchema,
  type MilestoneInput,
} from "@/features/milestone/services/schemas";
import { toast } from "sonner";

// Clean milestone data by converting empty strings to null
function cleanMilestoneData(data: MilestoneInput): MilestoneInput {
  return {
    ...data,
    completionDate: data.completionDate || null,
    remarks: data.remarks || null,
  };
}

export function useAddMilestoneForm(
  projectId: string,
  onOpenChange: (open: boolean) => void
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMilestone = useCreateMilestone();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<MilestoneInput>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      projectId,
      status: "pending",
    },
  });

  const status = watch("status");

  const onSubmit = async (data: MilestoneInput) => {
    setIsSubmitting(true);
    try {
      const cleanedData = cleanMilestoneData(data);

      await createMilestone.mutateAsync(cleanedData);
      toast.success("Milestone created successfully");
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to create milestone");
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
