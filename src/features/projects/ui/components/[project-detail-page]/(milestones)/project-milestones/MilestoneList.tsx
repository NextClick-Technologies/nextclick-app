"use client";

import { Milestone } from "@/features/milestone/domain/types";
import { Button } from "@/shared/components/ui/button";
import { MilestoneTimelineItem } from "./milestone-timeline-item";
import { CalendarClock, Plus } from "lucide-react";
import { StatusFilter } from "./MilestoneFilters";

interface MilestoneListProps {
  milestones: Milestone[];
  isLoading: boolean;
  statusFilter: StatusFilter;
  onStatusFilterChange: (value: StatusFilter) => void;
  onEdit: (milestone: Milestone) => void;
  onDelete: (milestone: Milestone) => void;
  onAddClick: () => void;
}

export function MilestoneList({
  milestones,
  isLoading,
  statusFilter,
  onStatusFilterChange,
  onEdit,
  onDelete,
  onAddClick,
}: MilestoneListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (milestones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <CalendarClock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">
          {statusFilter === "all"
            ? "No milestones yet"
            : `No ${statusFilter.replace("_", " ")} milestones`}
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          {statusFilter === "all"
            ? "Create your first milestone to start tracking project progress"
            : "No milestones match the selected filter"}
        </p>
        {statusFilter === "all" && (
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Milestone
          </Button>
        )}
        {statusFilter !== "all" && (
          <Button variant="outline" onClick={() => onStatusFilterChange("all")}>
            View All Milestones
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="relative ml-4">
      {milestones.map((milestone, index) => (
        <MilestoneTimelineItem
          key={milestone.id}
          milestone={milestone}
          isFirst={index === 0}
          isLast={index === milestones.length - 1}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
