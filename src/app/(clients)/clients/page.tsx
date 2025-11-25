"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, Search, Loader2 } from "lucide-react";
import { AddClientDialog } from "./components/AddClientDialog";
import { ClientTable } from "./components/ClientTable";
import { useClients } from "@/hooks/useApi";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useClients({ page, pageSize });

  const clients = data?.data || [];
  const totalClients = data?.pagination.total || 0;

  // Filter clients based on search query
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.familyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Client Management
            </h1>
            <p className="text-muted-foreground">
              Manage your clients and track their projects
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Client
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Total Clients" value={totalClients} isLoading={isLoading} />
          <MetricCard
            label="Male Clients"
            value={clients.filter((c) => c.gender === "MALE").length}
            badge={<Badge>{clients.filter((c) => c.gender === "MALE").length}</Badge>}
            isLoading={isLoading}
          />
          <MetricCard
            label="Female Clients"
            value={clients.filter((c) => c.gender === "FEMALE").length}
            badge={<Badge variant="secondary">{clients.filter((c) => c.gender === "FEMALE").length}</Badge>}
            isLoading={isLoading}
          />
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Client Database</h2>
              <div className="flex items-center gap-4">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
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
            
            {!isLoading && !error && <ClientTable clients={filteredClients} />}
            
            {!isLoading && !error && filteredClients.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No clients found
              </div>
            )}
          </div>
        </Card>
      </div>

      <AddClientDialog
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
