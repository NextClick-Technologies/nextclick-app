import { useMilestones } from "@/features/milestone/ui/hooks/useMilestone";

export function useMilestoneStats(projectId: string) {
  const { data, isLoading } = useMilestones({
    projectId,
  });

  const milestones = data?.data || [];

  // Calculate statistics
  const stats = {
    total: milestones.length,
    completed: milestones.filter((m) => m.status === "completed").length,
    inProgress: milestones.filter((m) => m.status === "in_progress").length,
    pending: milestones.filter((m) => m.status === "pending").length,
    cancelled: milestones.filter((m) => m.status === "cancelled").length,
  };

  // Calculate overall progress percentage
  const progressPercentage =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return {
    stats,
    progressPercentage,
    isLoading,
  };
}
