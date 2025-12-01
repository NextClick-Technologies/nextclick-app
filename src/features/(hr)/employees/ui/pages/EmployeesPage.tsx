"use client";

import { useState, useMemo } from "react";
import { EmployeeHeader } from "../components/EmployeeHeader";
import { EmployeeMetrics } from "../components/EmployeeMetrics";
import { EmployeeDatabase } from "../components/employee-database";
import { AddEmployeeDialog } from "../components/add-employee-dialog";
import { useEmployees } from "../hooks";
import type { Employee } from "../../services/types";

export default function EmployeesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, error } = useEmployees();

  const employees = useMemo(
    () => (data?.data || []) as Employee[],
    [data?.data]
  );
  const totalEmployees = data?.pagination?.total || employees.length;

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee: Employee) => {
      const matchesSearch =
        employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        employee.phoneNumber?.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" ||
        employee.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <EmployeeHeader onAddClick={() => setIsAddDialogOpen(true)} />
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
      <AddEmployeeDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
