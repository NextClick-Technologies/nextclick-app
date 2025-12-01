"use client";

import { Milestone } from "@/features/milestone/domain/types";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { Clock, Pencil, Trash2 } from "lucide-react";
import { StatusConfig } from "./MilestoneStatusConfig";
import { formatDate, getDateRange } from "./MilestoneDateUtils";

interface MilestoneCardProps {
  milestone: Milestone;
  statusConfig: StatusConfig;
  overdue: boolean;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestone: Milestone) => void;
}

export function MilestoneCard({
  milestone,
  statusConfig,
  overdue,
  onEdit,
  onDelete,
}: MilestoneCardProps) {
  const StatusIcon = statusConfig.icon;

  return (
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
  );
}
