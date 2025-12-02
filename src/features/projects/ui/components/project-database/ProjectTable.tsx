"use client";

import { useRouter } from "next/navigation";
import {
  Project,
  ProjectStatus,
  ProjectPriority,
} from "@/features/projects/domain/types";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar } from "@/shared/components/ui/avatar";
import { sanitizeHtml } from "@/shared/utils/sanitize";
import { FolderKanban } from "lucide-react";

interface ProjectTableProps {
  projects: Project[];
}

export function ProjectTable({ projects }: ProjectTableProps) {
  const router = useRouter();

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusVariant = (
    status: ProjectStatus
  ): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return "default";
      case ProjectStatus.COMPLETED:
        return "secondary";
      case ProjectStatus.ON_HOLD:
        return "outline";
      case ProjectStatus.CANCELLED:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPriorityVariant = (
    priority: ProjectPriority | null
  ): "default" | "secondary" | "outline" | "destructive" => {
    if (!priority) return "outline";
    switch (priority) {
      case ProjectPriority.URGENT:
      case ProjectPriority.HIGH:
        return "destructive";
      case ProjectPriority.MEDIUM:
        return "default";
      case ProjectPriority.LOW:
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleRowClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto max-h-[calc(100vh-24rem)] overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Project
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Type
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Priority
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Budget
              </th>
              <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {projects.map((project) => (
              <tr
                key={project.id}
                onClick={() => handleRowClick(project.id)}
                className="group hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center">
                      <FolderKanban className="h-5 w-5 text-primary" />
                    </Avatar>
                    <div>
                      <p className="font-medium">{project.name}</p>
                      {project.description && (
                        <div
                          className="text-sm text-muted-foreground max-w-xs truncate"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(project.description),
                          }}
                        />
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <p className="text-sm">{project.type || "-"}</p>
                </td>
                <td className="py-4">
                  {project.priority ? (
                    <Badge variant={getPriorityVariant(project.priority)}>
                      {project.priority}
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </td>
                <td className="py-4 text-left">
                  <p className="font-medium">
                    ${Number(project.budget || 0).toLocaleString()}
                  </p>
                </td>
                <td className="py-4">
                  <Badge variant={getStatusVariant(project.status)}>
                    {project.status.replace("_", " ")}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => handleRowClick(project.id)}
            className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors space-y-3"
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12 bg-primary/10 flex items-center justify-center shrink-0">
                <FolderKanban className="h-6 w-6 text-primary" />
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{project.name}</p>
                {project.description && (
                  <div
                    className="text-sm text-muted-foreground line-clamp-2 mt-1"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(project.description),
                    }}
                  />
                )}
              </div>
              <Badge variant={getStatusVariant(project.status)}>
                {project.status.replace("_", " ")}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              {project.type && (
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground text-xs">Type:</span>
                  <span>{project.type}</span>
                </div>
              )}
              {project.priority && (
                <Badge
                  variant={getPriorityVariant(project.priority)}
                  className="text-xs"
                >
                  {project.priority}
                </Badge>
              )}
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-muted-foreground text-xs">Budget:</span>
                <span className="font-medium">
                  ${Number(project.budget || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProjectTable;
