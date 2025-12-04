"use client";

import { Milestone } from "@/features/milestone/domain/types";
import { cn } from "@/shared/utils/cn";
import { getStatusConfig } from "./MilestoneStatusConfig";
import { isOverdue } from "./MilestoneDateUtils";
import { MilestoneCard } from "./MilestoneCard";
import { TimelineConnector } from "./TimelineConnector";

interface MilestoneTimelineItemProps {
  milestone: Milestone;
  isFirst?: boolean;
  isLast?: boolean;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestone: Milestone) => void;
  onManageTeam?: (milestone: Milestone) => void;
}

export function MilestoneTimelineItem({
  milestone,
  isLast,
  onEdit,
  onDelete,
  onManageTeam,
}: MilestoneTimelineItemProps) {
  const statusConfig = getStatusConfig(milestone.status);
  const overdue = isOverdue(milestone);

  return (
    <div className={cn("relative pb-8 pl-8", isLast && "pb-0")}>
      <TimelineConnector
        milestone={milestone}
        statusConfig={statusConfig}
        isLast={!!isLast}
      />

      <MilestoneCard
        milestone={milestone}
        statusConfig={statusConfig}
        overdue={overdue}
        onEdit={onEdit}
        onDelete={onDelete}
        onManageTeam={onManageTeam}
      />
    </div>
  );
}
