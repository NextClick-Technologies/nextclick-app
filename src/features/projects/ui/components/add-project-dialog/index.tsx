"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useCreateProject } from "@/features/projects/ui/hooks/useProject";
import { useClients } from "@/features/clients/ui/hooks/useClient";
import { useEmployees } from "@/features/employees/ui/hooks/useEmployee";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  projectSchema,
  type ProjectInput,
} from "@/features/projects/domain/schemas";
import { FormField } from "./FormField";
import { ClientSelect } from "./ClientSelect";
import { ProjectManagerSelect } from "./ProjectManagerSelect";
import { DescriptionField } from "./DescriptionField";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  ProjectStatus,
  ProjectPriority,
} from "@/features/projects/domain/types";

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
  const { data: employeesData } = useEmployees({ pageSize: 100 });
  const employees = employeesData?.data || [];

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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="space-y-4 overflow-y-auto flex-1 px-1 sm:p-2">
            {/* Project Name and Client side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Project Manager and Type side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                name="projectManager"
                control={control}
                render={({ field }) => (
                  <ProjectManagerSelect
                    value={field.value ?? ""}
                    employees={employees}
                    onChange={field.onChange}
                  />
                )}
              />

              <FormField
                label="Type (Optional)"
                id="type"
                placeholder="e.g., web-development"
                register={register}
              />
            </div>

            {/* Budget and Payment Terms inline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Budget (Optional)"
                id="budget"
                type="number"
                placeholder="Enter budget"
                register={register}
              />

              <div className="space-y-2">
                <Controller
                  name="paymentTerms"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Label htmlFor="paymentTerms">Payment Terms</Label>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net_30d">Net 30 Days</SelectItem>
                          <SelectItem value="net_60d">Net 60 Days</SelectItem>
                          <SelectItem value="net_90d">Net 90 Days</SelectItem>
                          <SelectItem value="immediate">Immediate</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                />
              </div>
            </div>

            {/* Start Date and Finish Date side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {/* Status and Priority side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ProjectStatus.ACTIVE}>
                          Active
                        </SelectItem>
                        <SelectItem value={ProjectStatus.COMPLETED}>
                          Completed
                        </SelectItem>
                        <SelectItem value={ProjectStatus.ON_HOLD}>
                          On Hold
                        </SelectItem>
                        <SelectItem value={ProjectStatus.CANCELLED}>
                          Cancelled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ProjectPriority.LOW}>Low</SelectItem>
                        <SelectItem value={ProjectPriority.MEDIUM}>
                          Medium
                        </SelectItem>
                        <SelectItem value={ProjectPriority.HIGH}>
                          High
                        </SelectItem>
                        <SelectItem value={ProjectPriority.URGENT}>
                          Urgent
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            {/* Description */}
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

          <div className="flex flex-col sm:flex-row gap-3 pt-4 mt-4">
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
