"use client";

import { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import { UpdateCompanyInput } from "@/features/companies/domain/schemas";
import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { StatusSelect } from "./StatusSelect";

interface EditCompanyFormProps {
  register: UseFormRegister<UpdateCompanyInput>;
  errors: FieldErrors<UpdateCompanyInput>;
  control: Control<UpdateCompanyInput>;
}

export function EditCompanyForm({
  register,
  errors,
  control,
}: EditCompanyFormProps) {
  return (
    <div className="space-y-4 py-4">
      {/* Company Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Company Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Email and Phone side-by-side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input id="phoneNumber" {...register("phoneNumber")} />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register("address")} />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      {/* Contact Person and Industry side-by-side */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">Contact Person</Label>
          <Input id="contactPerson" {...register("contactPerson")} />
          {errors.contactPerson && (
            <p className="text-sm text-destructive">
              {errors.contactPerson.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Input id="industry" {...register("industry")} />
          {errors.industry && (
            <p className="text-sm text-destructive">
              {errors.industry.message}
            </p>
          )}
        </div>
      </div>

      {/* Status */}
      <StatusSelect control={control} />
    </div>
  );
}
