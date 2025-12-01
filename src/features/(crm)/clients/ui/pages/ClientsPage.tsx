"use client";

import { useState } from "react";
import { AddClientDialog, ClientMetrics, ClientDatabase } from "../components";
import { useClients } from "../hooks";

export function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const page = 1;
  const pageSize = 20;

  const { data, isLoading, error } = useClients({ page, pageSize });

  const clients = data?.data || [];
  const totalClients = data?.pagination.total || 0;
  const companies =
    (data?.metadata?.companies as { id: string; name: string }[]) || [];
  const projectCounts =
    (data?.metadata?.projectCounts as { clientId: string; count: number }[]) ||
    [];

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      (client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.familyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "all" || client.status === statusFilter)
  );

  return (
    <div className="space-y-4">
      <ClientMetrics
        clients={clients}
        totalClients={totalClients}
        isLoading={isLoading}
      />

      <ClientDatabase
        clients={filteredClients}
        companies={companies}
        projectCounts={projectCounts}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        isLoading={isLoading}
        error={error}
        onAddClick={() => setIsAddDialogOpen(true)}
      />

      <AddClientDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
