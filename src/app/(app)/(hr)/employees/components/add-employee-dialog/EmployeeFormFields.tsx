"use client";

import { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";
import { EmployeeInput } from "@/features/(hr)/employees/services/schemas";
import { FormField } from "./FormField";
import { EmployeeSelectFields } from "./EmployeeSelectFields";
import { StatusSelect } from "./StatusSelect";
import { JoinDateInput } from "./JoinDateInput";
import { PhotoUpload } from "./PhotoUpload";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface EmployeeFormFieldsProps {
  register: UseFormRegister<EmployeeInput>;
  control: Control<EmployeeInput>;
  errors: FieldErrors<EmployeeInput>;
  employeeName: string;
  setEmployeeName: (name: string) => void;
}

export function EmployeeFormFields({
  register,
  control,
  errors,
  employeeName,
  setEmployeeName,
}: EmployeeFormFieldsProps) {
  return (
    <>
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
            onChange={(url) => {
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
    </>
  );
}
