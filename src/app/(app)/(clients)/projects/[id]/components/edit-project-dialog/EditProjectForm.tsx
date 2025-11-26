"use client";

import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { UpdateProjectInput } from "@/schemas";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClientSelect } from "./ClientSelect";
import { ProjectSelects } from "./ProjectSelects";

interface EditProjectFormProps {
  register: UseFormRegister<UpdateProjectInput>;
  errors: FieldErrors<UpdateProjectInput>;
  control: Control<UpdateProjectInput>;
}

export function EditProjectForm({
  register,
  errors,
  control,
}: EditProjectFormProps) {
  return (
    <div className="space-y-4 py-4">
      {/* Project Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Project Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Client and Type side-by-side */}
      <div className="grid grid-cols-2 gap-4">
        <ClientSelect control={control} errors={errors} />
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Input id="type" {...register("type")} />
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>
      </div>

      {/* Start Date and Finish Date side-by-side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" {...register("startDate")} />
          {errors.startDate && (
            <p className="text-sm text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="finishDate">Finish Date</Label>
          <Input id="finishDate" type="date" {...register("finishDate")} />
          {errors.finishDate && (
            <p className="text-sm text-destructive">
              {errors.finishDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Budget, Payment Terms, Priority, Status */}
      <ProjectSelects control={control} register={register} errors={errors} />

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} rows={4} />
        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>
    </div>
  );
}
