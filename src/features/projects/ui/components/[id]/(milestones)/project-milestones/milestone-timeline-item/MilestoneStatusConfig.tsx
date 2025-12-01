import { Milestone } from "@/features/milestone/domain/types/milestone.type";
import { CheckCircle2, Circle, XCircle, Clock, LucideIcon } from "lucide-react";

export interface StatusConfig {
  icon: LucideIcon;
  color: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  label: string;
}

export function getStatusConfig(status: Milestone["status"]): StatusConfig {
  switch (status) {
    case "completed":
      return {
        icon: CheckCircle2,
        color: "bg-green-500",
        variant: "secondary",
        label: "Completed",
      };
    case "in_progress":
      return {
        icon: Clock,
        color: "bg-blue-500",
        variant: "default",
        label: "In Progress",
      };
    case "cancelled":
      return {
        icon: XCircle,
        color: "bg-red-500",
        variant: "destructive",
        label: "Cancelled",
      };
    case "pending":
    default:
      return {
        icon: Circle,
        color: "bg-gray-400",
        variant: "outline",
        label: "Pending",
      };
  }
}
