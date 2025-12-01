import {
  ProjectStatus,
  ProjectPriority,
} from "@/features/projects/domain/types";

export const getStatusVariant = (
  status: ProjectStatus
): "default" | "secondary" | "outline" | "destructive" => {
  switch (status) {
    case "active":
      return "default";
    case "completed":
      return "secondary";
    case "on_hold":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

export const getPriorityVariant = (
  priority: ProjectPriority | null
): "default" | "secondary" | "outline" | "destructive" => {
  if (!priority) return "outline";
  switch (priority) {
    case "high":
    case "urgent":
      return "destructive";
    case "medium":
      return "default";
    case "low":
      return "secondary";
    default:
      return "outline";
  }
};

export const formatDate = (date: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString();
};
