"use client";

import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Client } from "../../../services/types/client.type";
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
  onAddClick: () => void;
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
  onAddClick,
}: ClientDatabaseProps) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold sm:text-xl">Client Database</h2>
          <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <Button
              onClick={onAddClick}
              size="sm"
              className="hidden sm:flex sm:shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New Client
            </Button>
            <ClientFilters
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              statusFilter={statusFilter}
              onStatusChange={onStatusChange}
            />
          </div>
        </div>
        <Button onClick={onAddClick} className="w-full sm:hidden">
          <Plus className="h-4 w-4 mr-2" />
          Add New Client
        </Button>

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
