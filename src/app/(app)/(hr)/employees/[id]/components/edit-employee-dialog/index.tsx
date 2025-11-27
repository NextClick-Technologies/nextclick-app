"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useUpdateEmployee } from "@/hooks/useEmployee";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { employeeSchema, type EmployeeInput } from "@/schemas/employee.schema";
import { FormField } from "../../../components/add-employee-dialog/FormField";
import { EmployeeSelectFields } from "../../../components/add-employee-dialog/EmployeeSelectFields";
import { StatusSelect } from "../../../components/add-employee-dialog/StatusSelect";
import { JoinDateInput } from "../../../components/add-employee-dialog/JoinDateInput";
import { PhotoUpload } from "../../../components/add-employee-dialog/PhotoUpload";
import { Employee } from "@/types";
import { useState } from "react";

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<EmployeeInput>({
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
      // Transform camelCase to snake_case for database
      const dbData = {
        title: data.title || null,
        name: data.name,
        family_name: data.familyName,
        preferred_name: data.preferredName || null,
        gender: data.gender,
        phone_number: data.phoneNumber,
        email: data.email,
        photo: data.photo || null,
        user_id: data.userId || null,
        status: data.status,
        department: data.department || null,
        position: data.position || null,
        join_date: data.joinDate || null,
        salary: data.salary || null,
        emergency_contact: data.emergencyContact || null,
        emergency_phone: data.emergencyPhone || null,
        address: data.address || null,
        city: data.city || null,
        state: data.state || null,
        zip_code: data.zipCode || null,
        country: data.country || null,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await updateEmployee.mutateAsync({
        id: employee.id,
        data: dbData as any,
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update employee:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
          <EmployeeSelectFields control={control} />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="First Name"
              id="name"
              placeholder="Enter first name"
              register={{
                ...register("name"),
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange: async (e: any) => {
                  await register("name").onChange(e);
                  setEmployeeName(e.target.value);
                },
              }}
              error={errors.name}
              required
            />

            <FormField
              label="Family Name"
              id="familyName"
              placeholder="Enter family name"
              register={register}
              error={errors.familyName}
              required
            />
          </div>

          <FormField
            label="Preferred Name"
            id="preferredName"
            placeholder="Enter preferred name or nickname"
            register={register}
            error={errors.preferredName}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Phone Number"
              id="phoneNumber"
              placeholder="+1234567890"
              register={register}
              error={errors.phoneNumber}
              required
            />

            <FormField
              label="Email"
              id="email"
              type="email"
              placeholder="email@example.com"
              register={register}
              error={errors.email}
              required
            />
          </div>

          <Controller
            name="photo"
            control={control}
            render={({ field }) => (
              <PhotoUpload
                value={field.value || null}
                onChange={(url: string | null) => {
                  field.onChange(url);
                }}
                employeeName={employeeName}
              />
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Department"
              id="department"
              placeholder="Engineering, Sales, HR..."
              register={register}
              error={errors.department}
            />

            <FormField
              label="Position"
              id="position"
              placeholder="Software Engineer, Manager..."
              register={register}
              error={errors.position}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <JoinDateInput register={register} error={errors.joinDate} />
            <StatusSelect control={control} error={errors.status} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Street address"
              {...register("address")}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="City"
              id="city"
              placeholder="City"
              register={register}
              error={errors.city}
            />

            <FormField
              label="State"
              id="state"
              placeholder="State"
              register={register}
              error={errors.state}
            />

            <FormField
              label="Zip Code"
              id="zipCode"
              placeholder="12345"
              register={register}
              error={errors.zipCode}
            />
          </div>

          <FormField
            label="Country"
            id="country"
            placeholder="Country"
            register={register}
            error={errors.country}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Emergency Contact"
              id="emergencyContact"
              placeholder="Contact person name"
              register={register}
              error={errors.emergencyContact}
            />

            <FormField
              label="Emergency Phone"
              id="emergencyPhone"
              placeholder="+1234567890"
              register={register}
              error={errors.emergencyPhone}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || updateEmployee.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || updateEmployee.isPending}
            >
              {(isSubmitting || updateEmployee.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
