"use client";

interface ProgressBarProps {
  progressPercentage: number;
  completed: number;
  total: number;
}

export function ProgressBar({
  progressPercentage,
  completed,
  total,
}: ProgressBarProps) {
  return (
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
        {completed} of {total} milestones completed
      </p>
    </div>
  );
}
