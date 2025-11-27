"use client";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Employee } from "@/types";
import { EmployeeTable } from "./EmployeeTable";
import { EmployeeFilters } from "./EmployeeFilters";

interface EmployeeDatabaseProps {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function EmployeeDatabase({
  employees,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  isLoading,
  error,
}: EmployeeDatabaseProps) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold sm:text-xl">
            Employee Database
          </h2>
          <EmployeeFilters
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            statusFilter={statusFilter}
            onStatusChange={onStatusChange}
          />
        </div>

        {error && (
          <div className="text-center py-8 text-destructive">
            Error loading employees: {error.message}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && !error && <EmployeeTable employees={employees} />}

        {!isLoading && !error && employees.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No employees found
          </div>
        )}
      </div>
    </Card>
  );
}
