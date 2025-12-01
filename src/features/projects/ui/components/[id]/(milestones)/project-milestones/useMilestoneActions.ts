import { useState } from "react";
import { Milestone } from "@/features/milestone/domain/types/milestone.type";
import { useDeleteMilestone } from "@/features/milestone/ui/hooks/useMilestone";
import { toast } from "sonner";

export function useMilestoneActions() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<Milestone | null>(
    null
  );

  const deleteMilestone = useDeleteMilestone();

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

  return {
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
  };
}
