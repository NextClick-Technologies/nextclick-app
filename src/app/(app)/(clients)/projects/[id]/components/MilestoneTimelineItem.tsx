"use client";

import { Milestone } from "@/types/milestone.type";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";
import {
  CheckCircle2,
  Circle,
  XCircle,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";
import { format, isPast } from "date-fns";

interface MilestoneTimelineItemProps {
  milestone: Milestone;
  isFirst?: boolean;
  isLast?: boolean;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestone: Milestone) => void;
}

const getStatusConfig = (status: Milestone["status"]) => {
  switch (status) {
    case "completed":
      return {
        icon: CheckCircle2,
        color: "bg-green-500",
        variant: "secondary" as const,
        label: "Completed",
      };
    case "in_progress":
      return {
        icon: Clock,
        color: "bg-blue-500",
        variant: "default" as const,
        label: "In Progress",
      };
    case "cancelled":
      return {
        icon: XCircle,
        color: "bg-red-500",
        variant: "destructive" as const,
        label: "Cancelled",
      };
    case "pending":
    default:
      return {
        icon: Circle,
        color: "bg-gray-400",
        variant: "outline" as const,
        label: "Pending",
      };
  }
};

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return "Invalid date";
  }
};

const getDateRange = (startDate: string, finishDate: string) => {
  try {
    const start = format(new Date(startDate), "MMM dd");
    const finish = format(new Date(finishDate), "MMM dd, yyyy");
    return `${start} → ${finish}`;
  } catch {
    return "Invalid date range";
  }
};

const isOverdue = (milestone: Milestone) => {
  if (milestone.status === "completed" || milestone.status === "cancelled") {
    return false;
  }
  try {
    return isPast(new Date(milestone.finishDate));
  } catch {
    return false;
  }
};

export function MilestoneTimelineItem({
  milestone,
  isLast,
  onEdit,
  onDelete,
}: MilestoneTimelineItemProps) {
  const statusConfig = getStatusConfig(milestone.status);
  const StatusIcon = statusConfig.icon;
  const overdue = isOverdue(milestone);

  return (
    <div className={cn("relative pb-8 pl-8", isLast && "pb-0")}>
      {/* Timeline connector line */}
      {!isLast && (
        <div className="absolute left-[7px] top-6 h-full w-0.5 bg-border" />
      )}

      {/* Status indicator dot */}
      <div className="absolute -left-[9px] top-0">
        <div
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full border-2 border-background",
            statusConfig.color
          )}
        >
          {milestone.status === "in_progress" && (
            <div className="h-2 w-2 animate-pulse rounded-full bg-white" />
          )}
        </div>
      </div>

      {/* Milestone card */}
      <Card
        className={cn(
          "p-4 transition-all hover:shadow-md",
          overdue &&
            "border-red-300 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {/* Header with status badge */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold">{milestone.name}</h3>
              <Badge variant={statusConfig.variant} className="gap-1">
                <StatusIcon className="h-3 w-3" />
                {statusConfig.label}
              </Badge>
              {overdue && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground">
              {milestone.description}
            </p>

            {/* Date range */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {getDateRange(milestone.startDate, milestone.finishDate)}
                </span>
              </div>

              {milestone.completionDate && (
                <div className="text-green-600 dark:text-green-400">
                  ✓ Completed: {formatDate(milestone.completionDate)}
                </div>
              )}
            </div>

            {/* Remarks */}
            {milestone.remarks && (
              <div className="mt-2 rounded-md bg-muted/50 p-2 text-sm italic text-muted-foreground">
                &ldquo;{milestone.remarks}&rdquo;
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(milestone)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(milestone)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
