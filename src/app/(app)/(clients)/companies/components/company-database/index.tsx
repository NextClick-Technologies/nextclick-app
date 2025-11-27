"use client";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Company } from "@/types";
import { CompanyTable } from "./CompanyTable";
import { CompanyFilters } from "./CompanyFilters";

interface CompanyDatabaseProps {
  companies: Company[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function CompanyDatabase({
  companies,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  isLoading,
  error,
}: CompanyDatabaseProps) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold sm:text-xl">Company Database</h2>
          <CompanyFilters
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            statusFilter={statusFilter}
            onStatusChange={onStatusChange}
          />
        </div>

        {error && (
          <div className="text-center py-8 text-destructive">
            Error loading companies: {error.message}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && !error && <CompanyTable companies={companies} />}

        {!isLoading && !error && companies.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No companies found
          </div>
        )}
      </div>
    </Card>
  );
}
