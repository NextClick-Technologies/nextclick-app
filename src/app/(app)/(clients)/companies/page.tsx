"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useCompanies } from "@/hooks/useCompany";
import { AddCompanyDialog } from "./components/add-company-dialog";
import { CompanyDatabase } from "./components/company-database";
import { CompanyMetrics } from "./components/CompanyMetrics";

export default function CompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [page] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useCompanies({ page, pageSize });

  const companies = data?.data || [];
  const totalCompanies = data?.pagination.total || 0;

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.address?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      company.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="space-y-4">
        <CompanyMetrics
          companies={companies}
          totalCompanies={totalCompanies}
          isLoading={isLoading}
        />

        <CompanyDatabase
          companies={filteredCompanies}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          isLoading={isLoading}
          error={error}
          onAddClick={() => setIsAddDialogOpen(true)}
        />
      </div>

      <AddCompanyDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </AppLayout>
  );
}
