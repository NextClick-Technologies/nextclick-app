/**
 * Project team member roles
 * Centralized role definitions for consistent use across the application
 */

export const PROJECT_ROLES = [
  { value: "fullstack", label: "Fullstack" },
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "ui-ux-designer", label: "UI/UX Designer" },
  { value: "finance", label: "Finance" },
  { value: "business", label: "Business" },
] as const;

export type ProjectRole = (typeof PROJECT_ROLES)[number]["value"];
