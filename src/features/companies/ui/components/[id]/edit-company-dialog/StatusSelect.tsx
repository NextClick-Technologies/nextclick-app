"use client";

import { Control, Controller } from "react-hook-form";
import { UpdateCompanyInput } from "@/features/companies/domain/schemas";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

interface StatusSelectProps {
  control: Control<UpdateCompanyInput>;
}

export function StatusSelect({ control }: StatusSelectProps) {
  return (
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
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        )}
      />
    </div>
  );
}
