"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { TrendingUp } from "lucide-react";
import { useMilestoneStats } from "./useMilestoneStats";
import { ProgressBar } from "./ProgressBar";
import { StatusBreakdown } from "./StatusBreakdown";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface MilestoneStatsProps {
  projectId: string;
}

export function MilestoneStats({ projectId }: MilestoneStatsProps) {
  const { stats, progressPercentage, isLoading } = useMilestoneStats(projectId);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (stats.total === 0) {
    return null; // Don't show stats if no milestones
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          Milestone Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressBar
          progressPercentage={progressPercentage}
          completed={stats.completed}
          total={stats.total}
        />
        <StatusBreakdown stats={stats} />
      </CardContent>
    </Card>
  );
}
