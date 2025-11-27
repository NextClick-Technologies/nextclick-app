"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Employee, EmployeeStatus } from "@/types";

interface EmployeeMetricsProps {
  employees: Employee[];
  totalEmployees: number;
  isLoading: boolean;
}

export function EmployeeMetrics({
  employees,
  totalEmployees,
  isLoading,
}: EmployeeMetricsProps) {
  const activeEmployees = employees.filter(
    (e) => e.status === EmployeeStatus.ACTIVE
  ).length;

  // Calculate recent hires (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentHires = employees.filter((e) => {
    if (!e.joinDate) return false;
    const joinDate = new Date(e.joinDate);
    return joinDate >= thirtyDaysAgo;
  }).length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <MetricCard
        label="Total Employees"
        value={totalEmployees}
        isLoading={isLoading}
      />
      <MetricCard
        label="Active Employees"
        value={activeEmployees}
        badge={<Badge>{activeEmployees}</Badge>}
        isLoading={isLoading}
      />
      <MetricCard
        label="Recent Hires (30d)"
        value={recentHires}
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
