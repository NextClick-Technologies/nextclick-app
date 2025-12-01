"use client";

import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { MilestoneInput } from "@/features/milestone/services/schemas";

interface AddMilestoneStatusFieldProps {
  status: MilestoneInput["status"];
  onStatusChange: (value: string) => void;
}

export function AddMilestoneStatusField({
  status,
  onStatusChange,
}: AddMilestoneStatusFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="status">Status</Label>
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
