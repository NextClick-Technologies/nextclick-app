"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AddEmployeeDialog } from "./components/add-employee-dialog";
import { EmployeeMetrics } from "./components/EmployeeMetrics";
import { EmployeeDatabase } from "./components/employee-database";
import { useEmployees } from "@/hooks/useEmployee";

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useEmployees({ page, pageSize });

  const employees = data?.data || [];
  const totalEmployees = data?.pagination.total || 0;

  // Filter employees based on search query
  const filteredEmployees = employees.filter(
    (employee) =>
      (employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.familyName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.preferredName
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())) &&
      (statusFilter === "all" || employee.status === statusFilter)
  );

  return (
    <AppLayout>
      <div className="space-y-4">
        <EmployeeMetrics
          employees={employees}
          totalEmployees={totalEmployees}
          isLoading={isLoading}
        />

        <EmployeeDatabase
          employees={filteredEmployees}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          isLoading={isLoading}
          error={error}
          onAddClick={() => setIsAddDialogOpen(true)}
        />
      </div>

      <AddEmployeeDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </AppLayout>
  );
}
