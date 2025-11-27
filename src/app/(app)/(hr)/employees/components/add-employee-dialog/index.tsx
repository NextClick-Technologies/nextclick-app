"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateEmployee } from "@/hooks/useEmployee";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, type EmployeeInput } from "@/schemas/employee.schema";
import { EmployeeStatus } from "@/types";
import { useState } from "react";
import { EmployeeFormFields } from "./EmployeeFormFields";
import { FormActions } from "./FormActions";
import { transformEmployeeToDb } from "./transform";

interface AddEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEmployeeDialog({
  open,
  onOpenChange,
}: AddEmployeeDialogProps) {
  const createEmployee = useCreateEmployee();
  const [employeeName, setEmployeeName] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: {
      status: EmployeeStatus.ACTIVE,
      joinDate: new Date().toISOString().split("T")[0],
    },
  });

  const onSubmit = async (data: EmployeeInput) => {
    try {
      const dbData = transformEmployeeToDb(data);

      await createEmployee.mutateAsync(dbData);
      reset();
      setEmployeeName("");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create employee:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-4">
            <EmployeeFormFields
              register={register}
              control={control}
              errors={errors}
              employeeName={employeeName}
              setEmployeeName={setEmployeeName}
            />
          </div>

          <FormActions
            isSubmitting={isSubmitting}
            isPending={createEmployee.isPending}
            onCancel={() => {
              reset();
              onOpenChange(false);
            }}
            submitLabel="Add Employee"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
