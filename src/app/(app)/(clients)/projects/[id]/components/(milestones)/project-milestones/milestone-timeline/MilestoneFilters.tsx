"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Filter } from "lucide-react";

type StatusFilter =
  | "all"
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

interface MilestoneFiltersProps {
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  onAddClick: () => void;
}

export function MilestoneFilters({
  statusFilter,
  onStatusFilterChange,
  onAddClick,
}: MilestoneFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Status Filter */}
      <Select
        value={statusFilter}
        onValueChange={(value) => onStatusFilterChange(value as StatusFilter)}
      >
        <SelectTrigger className="w-[150px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      {/* Add Milestone Button */}
      <Button onClick={onAddClick} size="sm">
        <Plus className="mr-2 h-4 w-4" />
        Add Milestone
      </Button>
    </div>
  );
}

export type { StatusFilter };
