"use client";

import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Search } from "lucide-react";
import { ClientStatus } from "../../../services/types";

interface ClientFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export function ClientFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: ClientFiltersProps) {
  return (
    <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center sm:gap-4">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value={ClientStatus.ACTIVE}>Active</SelectItem>
          <SelectItem value={ClientStatus.INACTIVE}>Inactive</SelectItem>
          <SelectItem value={ClientStatus.PENDING}>Pending</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
