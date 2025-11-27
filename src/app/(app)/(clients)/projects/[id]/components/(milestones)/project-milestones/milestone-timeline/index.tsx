"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMilestones } from "@/hooks/useMilestone";
import { AddMilestoneDialog } from "../AddMilestoneDialog";
import { EditMilestoneDialog } from "../EditMilestoneDialog";
import { CalendarClock } from "lucide-react";
import { MilestoneFilters, type StatusFilter } from "./MilestoneFilters";
import { MilestoneList } from "./MilestoneList";
import { DeleteMilestoneDialog } from "./DeleteMilestoneDialog";
import { useMilestoneActions } from "./useMilestoneActions";

interface MilestoneTimelineProps {
  projectId: string;
}

export function MilestoneTimeline({ projectId }: MilestoneTimelineProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const { data, isLoading, error } = useMilestones({
    projectId,
    orderBy: "startDate:asc",
  });

  const {
    addDialogOpen,
    setAddDialogOpen,
    editDialogOpen,
    setEditDialogOpen,
    selectedMilestone,
    deleteDialogOpen,
    setDeleteDialogOpen,
    milestoneToDelete,
    handleEdit,
    handleDeleteClick,
    confirmDelete,
    deleteMilestone,
  } = useMilestoneActions();

  // Filter milestones by status
  const filteredMilestones =
    data?.data?.filter((milestone) => {
      if (statusFilter === "all") return true;
      return milestone.status === statusFilter;
    }) || [];

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-destructive">
            Failed to load milestones. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Project Milestones</CardTitle>
              {data?.data && data.data.length > 0 && (
                <Badge variant="secondary">{data.data.length}</Badge>
              )}
            </div>

            <MilestoneFilters
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              onAddClick={() => setAddDialogOpen(true)}
            />
          </div>
        </CardHeader>

        <CardContent>
          <MilestoneList
            milestones={filteredMilestones}
            isLoading={isLoading}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onAddClick={() => setAddDialogOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Add Milestone Dialog */}
      <AddMilestoneDialog
        projectId={projectId}
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
      />

      {/* Edit Milestone Dialog */}
      <EditMilestoneDialog
        milestone={selectedMilestone}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteMilestoneDialog
        milestone={milestoneToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isPending={deleteMilestone.isPending}
      />
    </>
  );
}
