"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Project } from "@/types";
import { updateProjectSchema, UpdateProjectInput } from "@/schemas";
import { useUpdateProject } from "@/hooks/useProject";
import { EditProjectForm } from "./EditProjectForm";
import { FormActions } from "./FormActions";

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSuccess?: () => void;
}

export function EditProjectDialog({
  open,
  onOpenChange,
  project,
  onSuccess,
}: EditProjectDialogProps) {
  const updateProject = useUpdateProject();

  const formatDateForInput = (date: string | null) => {
    if (!date) return "";
    return date.split("T")[0]; // Convert ISO to YYYY-MM-DD
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProjectInput>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      name: project.name || "",
      type: project.type || "",
      startDate: formatDateForInput(project.startDate),
      finishDate: formatDateForInput(project.finishDate),
      budget: Number(project.budget || 0),
      paymentTerms: project.paymentTerms || "net_30d",
      status: project.status || "active",
      priority: project.priority || "medium",
      description: project.description || "",
      clientId: project.clientId || "",
      projectManager: project.projectManager || "",
    },
  });

  // Reset form when project changes
  useEffect(() => {
    reset({
      name: project.name || "",
      type: project.type || "",
      startDate: formatDateForInput(project.startDate),
      finishDate: formatDateForInput(project.finishDate),
      budget: Number(project.budget || 0),
      paymentTerms: project.paymentTerms || "net_30d",
      status: project.status || "active",
      priority: project.priority || "medium",
      description: project.description || "",
      clientId: project.clientId || "",
      projectManager: project.projectManager || "",
    });
  }, [project, reset]);

  const onSubmit = async (data: UpdateProjectInput) => {
    try {
      await updateProject.mutateAsync({ id: project.id, data });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-1">
            <EditProjectForm
              register={register}
              errors={errors}
              control={control}
            />
          </div>
          <FormActions
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
            isPending={updateProject.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
