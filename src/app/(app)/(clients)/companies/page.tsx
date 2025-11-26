"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useCompanies } from "@/hooks/useCompany";
import { AddCompanyDialog } from "./components/add-company-dialog";
import { CompanyDatabase } from "./components/company-database";

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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Company Management
            </h1>
            <p className="text-muted-foreground">
              Manage your company database and information
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Company
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Total Companies"
            value={totalCompanies}
            isLoading={isLoading}
          />
          <MetricCard
            label="With Email"
            value={companies.filter((c) => c.email).length}
            badge={<Badge>{companies.filter((c) => c.email).length}</Badge>}
            isLoading={isLoading}
          />
          <MetricCard
            label="With Address"
            value={companies.filter((c) => c.address).length}
            badge={
              <Badge variant="secondary">
                {companies.filter((c) => c.address).length}
              </Badge>
            }
            isLoading={isLoading}
          />
        </div>

        <CompanyDatabase
          companies={filteredCompanies}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          isLoading={isLoading}
          error={error}
        />
      </div>

      <AddCompanyDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </AppLayout>
  );
}

function MetricCard({
  label,
  value,
  badge,
  isLoading,
}: {
  label: string;
  value: string | number;
  badge?: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {badge}
        </div>
        {isLoading ? (
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </div>
    </Card>
  );
}
