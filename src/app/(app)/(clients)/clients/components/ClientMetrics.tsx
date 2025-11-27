"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Client, ClientStatus } from "@/types";

interface ClientMetricsProps {
  clients: Client[];
  totalClients: number;
  isLoading: boolean;
}

export function ClientMetrics({
  clients,
  totalClients,
  isLoading,
}: ClientMetricsProps) {
  const activeClients = clients.filter(
    (c) => c.status === ClientStatus.ACTIVE
  ).length;
  const totalValue = clients.reduce(
    (sum, client) => sum + (client.totalContractValue ?? 0),
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard
        label="Total Clients"
        value={totalClients}
        isLoading={isLoading}
      />
      <MetricCard
        label="Active Clients"
        value={activeClients}
        badge={<Badge>{activeClients}</Badge>}
        isLoading={isLoading}
      />
      <MetricCard
        label="Total Value"
        value={`$${totalValue.toLocaleString()}`}
        isLoading={isLoading}
      />
    </div>
  );
}

// MetricCard Component
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
    <Card className="p-4 sm:p-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">
            {label}
          </p>
          {badge}
        </div>
        {isLoading ? (
          <div className="h-6 sm:h-8 w-16 sm:w-20 bg-muted animate-pulse rounded" />
        ) : (
          <p className="text-xl sm:text-2xl font-bold">{value}</p>
        )}
      </div>
    </Card>
  );
}
