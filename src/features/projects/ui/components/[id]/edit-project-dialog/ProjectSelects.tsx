"use client";

import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { UpdateProjectInput } from "@/features/projects/services/schemas/project.schema";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface ProjectSelectsProps {
  control: Control<UpdateProjectInput>;
  register: UseFormRegister<UpdateProjectInput>;
  errors: FieldErrors<UpdateProjectInput>;
}

export function ProjectSelects({
  control,
  register,
  errors,
}: ProjectSelectsProps) {
  return (
    <>
      {/* Budget and Payment Terms side-by-side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            type="number"
            {...register("budget", { valueAsNumber: true })}
          />
          {errors.budget && (
            <p className="text-sm text-destructive">{errors.budget.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Controller
            name="paymentTerms"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
            )}
          />
          {errors.paymentTerms && (
            <p className="text-sm text-destructive">
              {errors.paymentTerms.message}
            </p>
          )}
        </div>
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.status && (
            <p className="text-sm text-destructive">{errors.status.message}</p>
          )}
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
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.priority && (
            <p className="text-sm text-destructive">
              {errors.priority.message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
