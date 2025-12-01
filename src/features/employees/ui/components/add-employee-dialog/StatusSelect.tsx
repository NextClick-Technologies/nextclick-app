import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { EmployeeStatus } from "@/features/employees/domain/types/employee.type";
import { Control, Controller, FieldError } from "react-hook-form";

interface StatusSelectProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  error?: FieldError;
}

export function StatusSelect({ control, error }: StatusSelectProps) {
  return (
    <Controller
      name="status"
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <Label htmlFor="status">
            Status<span className="text-destructive ml-1">*</span>
          </Label>
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EmployeeStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={EmployeeStatus.INACTIVE}>Inactive</SelectItem>
              <SelectItem value={EmployeeStatus.ON_LEAVE}>On Leave</SelectItem>
              <SelectItem value={EmployeeStatus.TERMINATED}>
                Terminated
              </SelectItem>
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}
