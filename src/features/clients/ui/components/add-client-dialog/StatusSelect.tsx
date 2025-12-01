import { Controller, Control, FieldErrors } from "react-hook-form";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { ClientStatus } from "../../../services/types/client.type";
import type { ClientInput } from "../../../services/schemas/client.schema";

interface StatusSelectProps {
  control: Control<ClientInput>;
  error?: FieldErrors<ClientInput>["status"];
}

export function StatusSelect({ control, error }: StatusSelectProps) {
  return (
    <Controller
      name="status"
      control={control}
      render={({ field }) => (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={field.value || ClientStatus.ACTIVE}
            onValueChange={field.onChange}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ClientStatus.ACTIVE}>Active</SelectItem>
              <SelectItem value={ClientStatus.INACTIVE}>Inactive</SelectItem>
              <SelectItem value={ClientStatus.PENDING}>Pending</SelectItem>
            </SelectContent>
          </Select>
          {error && <p className="text-sm text-destructive">{error.message}</p>}
        </div>
      )}
    />
  );
}
