"use client";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Client } from "@/types";
import { ClientTable } from "./ClientTable";
import { ClientFilters } from "./ClientFilters";

interface ClientDatabaseProps {
  clients: Client[];
  companies: { id: string; name: string }[];
  projectCounts: { clientId: string; count: number }[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function ClientDatabase({
  clients,
  companies,
  projectCounts,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  isLoading,
  error,
}: ClientDatabaseProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Client Database</h2>
          <ClientFilters
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            statusFilter={statusFilter}
            onStatusChange={onStatusChange}
          />
        </div>

        {error && (
          <div className="text-center py-8 text-destructive">
            Error loading clients: {error.message}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && !error && (
          <ClientTable
            clients={clients}
            companies={companies}
            projectCounts={projectCounts}
          />
        )}

        {!isLoading && !error && clients.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No clients found
          </div>
        )}
      </div>
    </Card>
  );
}
