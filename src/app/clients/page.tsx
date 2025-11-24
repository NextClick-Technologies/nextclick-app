"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { mockClients } from "@/lib/mockData";
import { AddClientDialog } from "./components/AddClientDialog";
import { ClientTable } from "./components/ClientTable";

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredClients = mockClients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeClients = mockClients.filter((c) => c.status === "active").length;
  const pendingClients = mockClients.filter(
    (c) => c.status === "pending"
  ).length;
  const totalValue = mockClients.reduce((sum, c) => sum + c.value, 0);

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
          <MetricCard label="Total Clients" value={mockClients.length} />
          <MetricCard
            label="Active Clients"
            value={activeClients}
            badge={<Badge>{activeClients}</Badge>}
          />
          <MetricCard
            label="Total Value"
            value={`$${(totalValue / 1000).toFixed(0)}K`}
            badge={<Badge variant="secondary">{pendingClients} pending</Badge>}
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
            <ClientTable clients={filteredClients} />
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
}: {
  label: string;
  value: string | number;
  badge?: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {badge}
        </div>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </Card>
  );
}
