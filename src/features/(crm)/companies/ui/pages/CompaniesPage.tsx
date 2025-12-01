"use client";

import { useState, useMemo } from "react";
import { CompanyMetrics } from "../components/CompanyMetrics";
import { CompanyDatabase } from "../components/company-database";
import { AddCompanyDialog } from "../components/add-company-dialog";
import { useCompanies } from "../hooks";
import type { Company } from "../../services/types";
import App from "next/app";
import { AppLayout } from "@/components/layout/AppLayout";

export default function CompaniesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, error } = useCompanies();

  const companies = useMemo(
    () => (data?.data || []) as Company[],
    [data?.data]
  );
  const totalCompanies = data?.pagination?.total || companies.length;

  const filteredCompanies = useMemo(() => {
    return companies.filter((company: Company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.phoneNumber?.includes(searchQuery);

      const matchesStatus =
        statusFilter === "all" ||
        company.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [companies, searchQuery, statusFilter]);

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
        <AddCompanyDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
    </AppLayout>
  );
}
