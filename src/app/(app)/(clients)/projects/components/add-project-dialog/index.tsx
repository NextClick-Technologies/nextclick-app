"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/hooks/useProject";
import { useClients } from "@/hooks/useClient";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectInput } from "@/schemas/project.schema";
import { FormField } from "./FormField";
import { ClientSelect } from "./ClientSelect";
import { ProjectSelectFields } from "./ProjectSelectFields";
import { DescriptionField } from "./DescriptionField";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProjectDialog({
  open,
  onOpenChange,
}: AddProjectDialogProps) {
  const createProject = useCreateProject();
  const { data: clientsData } = useClients({ pageSize: 100 });
  const clients = clientsData?.data || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectInput) => {
    try {
      await createProject.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="space-y-4 overflow-y-auto flex-1 p-2">
            <FormField
              label="Project Name"
              id="name"
              placeholder="Enter project name"
              register={register}
              error={errors.name}
            />

            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <ClientSelect
                    value={field.value ?? ""}
                    clients={clients}
                    onChange={field.onChange}
                    required
                  />
                  {errors.clientId && (
                    <p className="text-sm text-destructive">
                      {errors.clientId.message}
                    </p>
                  )}
                </div>
              )}
            />

            <FormField
              label="Type (Optional)"
              id="type"
              placeholder="e.g., web-development, mobile-app"
              register={register}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Start Date (Optional)"
                id="startDate"
                type="date"
                placeholder=""
                register={register}
              />

              <FormField
                label="Finish Date (Optional)"
                id="finishDate"
                type="date"
                placeholder=""
                register={register}
              />
            </div>

            <FormField
              label="Budget (Optional)"
              id="budget"
              type="number"
              placeholder="0"
              register={register}
            />

            <ProjectSelectFields control={control} />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <DescriptionField
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="flex gap-3 pt-4 mt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || createProject.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || createProject.isPending}
            >
              {(isSubmitting || createProject.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
