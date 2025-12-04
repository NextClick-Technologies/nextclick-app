"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useUpdateEmployee } from "@/features/employees/ui/hooks/useEmployee";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employeeSchema,
  type EmployeeInput,
} from "@/features/employees/domain/schemas";
import { Employee } from "@/features/employees/domain/types";
import { useState } from "react";
import { EmployeeFormFields } from "./EmployeeFormFields";
import { FormActions } from "./FormActions";

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  onSuccess: () => void;
}

export function EditEmployeeDialog({
  open,
  onOpenChange,
  employee,
  onSuccess,
}: EditEmployeeDialogProps) {
  const updateEmployee = useUpdateEmployee();
  const [employeeName, setEmployeeName] = useState(employee.name);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeInput>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(employeeSchema) as any,
    defaultValues: {
      title: employee.title,
      name: employee.name,
      familyName: employee.familyName,
      preferredName: employee.preferredName,
      gender: employee.gender,
      phoneNumber: employee.phoneNumber,
      email: employee.email,
      photo: employee.photo,
      userId: employee.userId,
      status: employee.status,
      department: employee.department,
      position: employee.position,
      joinDate: employee.joinDate,
      salary: employee.salary,
      emergencyContact: employee.emergencyContact,
      emergencyPhone: employee.emergencyPhone,
      address: employee.address,
      city: employee.city,
      state: employee.state,
      zipCode: employee.zipCode,
      country: employee.country,
    },
  });

  const onSubmit = async (data: EmployeeInput) => {
    try {
      await updateEmployee.mutateAsync({
        id: employee.id,
        data: data,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-6 space-y-4">
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
            isPending={updateEmployee.isPending}
            onCancel={() => onOpenChange(false)}
            submitLabel="Update Employee"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
