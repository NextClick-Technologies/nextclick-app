"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Company } from "@/features/(crm)/companies/services/types";

interface CompanyMetricsProps {
  companies: Company[];
  totalCompanies: number;
  isLoading: boolean;
}

export function CompanyMetrics({
  companies,
  totalCompanies,
  isLoading,
}: CompanyMetricsProps) {
  const activeCompanies = companies.filter(
    (c) => c.status?.toLowerCase() === "active"
  ).length;
  const withEmail = companies.filter((c) => c.email).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard
        label="Total Companies"
        value={totalCompanies}
        isLoading={isLoading}
      />
      <MetricCard
        label="Active Companies"
        value={activeCompanies}
        badge={<Badge>{activeCompanies}</Badge>}
        isLoading={isLoading}
      />
      <MetricCard
        label="With Email"
        value={withEmail}
        badge={<Badge variant="secondary">{withEmail}</Badge>}
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
