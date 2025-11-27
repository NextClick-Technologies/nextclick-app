"use client";

import { CheckCircle2, Clock, Circle, XCircle } from "lucide-react";

interface StatusBreakdownProps {
  stats: {
    completed: number;
    inProgress: number;
    pending: number;
    cancelled: number;
  };
}

export function StatusBreakdown({ stats }: StatusBreakdownProps) {
  return (
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
  );
}
