"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Project, ProjectStatus } from "@/types";

interface ProjectMetricsProps {
  projects: Project[];
  totalProjects: number;
  isLoading: boolean;
}

export function ProjectMetrics({
  projects,
  totalProjects,
  isLoading,
}: ProjectMetricsProps) {
  const activeProjects = projects.filter(
    (p) => p.status === ProjectStatus.ACTIVE
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === ProjectStatus.COMPLETED
  ).length;
  const totalBudget = projects.reduce(
    (sum, p) => sum + Number(p.budget || 0),
    0
  );

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard
        label="Total Projects"
        value={totalProjects}
        isLoading={isLoading}
      />
      <MetricCard
        label="Active"
        value={activeProjects}
        badge={<Badge>{activeProjects}</Badge>}
        isLoading={isLoading}
      />
      <MetricCard
        label="Completed"
        value={completedProjects}
        badge={<Badge variant="secondary">{completedProjects}</Badge>}
        isLoading={isLoading}
      />
      <MetricCard
        label="Total Budget"
        value={`$${(totalBudget / 1000).toFixed(0)}K`}
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
