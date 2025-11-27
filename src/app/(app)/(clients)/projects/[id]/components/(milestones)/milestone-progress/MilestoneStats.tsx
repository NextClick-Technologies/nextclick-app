"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMilestones } from "@/hooks/useMilestone";
import { CheckCircle2, Clock, Circle, XCircle, TrendingUp } from "lucide-react";

interface MilestoneStatsProps {
  projectId: string;
}

export function MilestoneStats({ projectId }: MilestoneStatsProps) {
  const { data, isLoading } = useMilestones({
    projectId,
  });

  const milestones = data?.data || [];

  // Calculate statistics
  const stats = {
    total: milestones.length,
    completed: milestones.filter((m) => m.status === "completed").length,
    inProgress: milestones.filter((m) => m.status === "in_progress").length,
    pending: milestones.filter((m) => m.status === "pending").length,
    cancelled: milestones.filter((m) => m.status === "cancelled").length,
  };

  // Calculate overall progress percentage
  const progressPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Milestone Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-8 w-full animate-pulse rounded bg-muted" />
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
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
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">{progressPercentage}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-linear-to-r from-blue-500 to-green-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.completed} of {stats.total} milestones completed
          </p>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {/* Completed */}
          <div className="flex flex-col items-center rounded-lg border bg-green-50/50 p-3 dark:bg-green-950/20">
            <CheckCircle2 className="mb-1 h-5 w-5 text-green-600 dark:text-green-400" />
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completed}
            </p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>

          {/* In Progress */}
          <div className="flex flex-col items-center rounded-lg border bg-blue-50/50 p-3 dark:bg-blue-950/20">
            <Clock className="mb-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.inProgress}
            </p>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </div>

          {/* Pending */}
          <div className="flex flex-col items-center rounded-lg border bg-gray-50/50 p-3 dark:bg-gray-950/20">
            <Circle className="mb-1 h-5 w-5 text-gray-600 dark:text-gray-400" />
            <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {stats.pending}
            </p>
            <p className="text-xs text-muted-foreground">Pending</p>
          </div>

          {/* Cancelled */}
          <div className="flex flex-col items-center rounded-lg border bg-red-50/50 p-3 dark:bg-red-950/20">
            <XCircle className="mb-1 h-5 w-5 text-red-600 dark:text-red-400" />
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {stats.cancelled}
            </p>
            <p className="text-xs text-muted-foreground">Cancelled</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
