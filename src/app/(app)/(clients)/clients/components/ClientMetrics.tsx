"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Client, Gender } from "@/types";

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
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard
        label="Total Clients"
        value={totalClients}
        isLoading={isLoading}
      />
      <MetricCard
        label="Male Clients"
        value={clients.filter((c) => c.gender === Gender.MALE).length}
        badge={
          <Badge>
            {clients.filter((c) => c.gender === Gender.MALE).length}
          </Badge>
        }
        isLoading={isLoading}
      />
      <MetricCard
        label="Female Clients"
        value={clients.filter((c) => c.gender === Gender.FEMALE).length}
        badge={
          <Badge variant="secondary">
            {clients.filter((c) => c.gender === Gender.FEMALE).length}
          </Badge>
        }
        isLoading={isLoading}
      />
    </div>
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
