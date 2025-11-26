"use client";

import { useState } from "react";
import { Milestone } from "@/types/milestone.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMilestones, useDeleteMilestone } from "@/hooks/useMilestone";
import { MilestoneTimelineItem } from "./MilestoneTimelineItem";
import { AddMilestoneDialog } from "./AddMilestoneDialog";
import { EditMilestoneDialog } from "./EditMilestoneDialog";
import { Plus, Filter, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MilestoneTimelineProps {
  projectId: string;
}

type StatusFilter =
  | "all"
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export function MilestoneTimeline({ projectId }: MilestoneTimelineProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<Milestone | null>(
    null
  );

  const { data, isLoading, error } = useMilestones({
    projectId,
    orderBy: "startDate:asc",
  });

  const deleteMilestone = useDeleteMilestone();

  // Filter milestones by status
  const filteredMilestones =
    data?.data?.filter((milestone) => {
      if (statusFilter === "all") return true;
      return milestone.status === statusFilter;
    }) || [];

  const handleEdit = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (milestone: Milestone) => {
    setMilestoneToDelete(milestone);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!milestoneToDelete) return;

    try {
      await deleteMilestone.mutateAsync(milestoneToDelete.id);
      toast.success("Milestone deleted successfully");
      setDeleteDialogOpen(false);
      setMilestoneToDelete(null);
    } catch (error) {
      toast.error("Failed to delete milestone");
      console.error(error);
    }
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Project Milestones</CardTitle>
              {data?.data && data.data.length > 0 && (
                <Badge variant="secondary">{data.data.length}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as StatusFilter)
                }
              >
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              {/* Add Milestone Button */}
              <Button onClick={() => setAddDialogOpen(true)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Milestone
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
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
          ) : filteredMilestones.length === 0 ? (
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
                <Button onClick={() => setAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Milestone
                </Button>
              )}
              {statusFilter !== "all" && (
                <Button
                  variant="outline"
                  onClick={() => setStatusFilter("all")}
                >
                  View All Milestones
                </Button>
              )}
            </div>
          ) : (
            <div className="relative ml-4">
              {filteredMilestones.map((milestone, index) => (
                <MilestoneTimelineItem
                  key={milestone.id}
                  milestone={milestone}
                  isFirst={index === 0}
                  isLast={index === filteredMilestones.length - 1}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
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
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Milestone</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{milestoneToDelete?.name}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteMilestone.isPending}
            >
              {deleteMilestone.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
