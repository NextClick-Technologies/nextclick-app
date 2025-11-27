import { Milestone } from "@/types/milestone.type";
import { format, isPast } from "date-fns";

export function formatDate(dateString: string): string {
  try {
    return format(new Date(dateString), "MMM dd, yyyy");
  } catch {
    return "Invalid date";
  }
}

export function getDateRange(startDate: string, finishDate: string): string {
  try {
    const start = format(new Date(startDate), "MMM dd");
    const finish = format(new Date(finishDate), "MMM dd, yyyy");
    return `${start} → ${finish}`;
  } catch {
    return "Invalid date range";
  }
}

export function isOverdue(milestone: Milestone): boolean {
  if (milestone.status === "completed" || milestone.status === "cancelled") {
    return false;
  }
  try {
    return isPast(new Date(milestone.finishDate));
  } catch {
    return false;
  }
}
