"use client";

import { cn } from "@/shared/utils/cn";
import { Milestone } from "@/features/milestone/domain/types";
import { StatusConfig } from "./MilestoneStatusConfig";

interface TimelineConnectorProps {
  milestone: Milestone;
  statusConfig: StatusConfig;
  isLast: boolean;
}

export function TimelineConnector({
  milestone,
  statusConfig,
  isLast,
}: TimelineConnectorProps) {
  return (
    <>
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
    </>
  );
}
