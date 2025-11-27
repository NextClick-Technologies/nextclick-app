// Format date for input field (YYYY-MM-DD)
export function formatDateForInput(
  dateString: string | null | undefined
): string {
  if (!dateString) return "";
  try {
    return new Date(dateString).toISOString().split("T")[0];
  } catch {
    return "";
  }
}

// Clean up empty strings to null for optional fields
export function cleanMilestoneData<T extends Record<string, any>>(data: T): T {
  return {
    ...data,
    completionDate: data.completionDate || null,
    remarks: data.remarks || null,
  };
}
