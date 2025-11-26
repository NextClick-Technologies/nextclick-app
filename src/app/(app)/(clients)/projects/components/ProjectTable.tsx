"use client";

import { useRouter } from "next/navigation";
import { Project } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "COMPLETED":
        return "secondary";
      case "ON_HOLD":
        return "outline";
      default:
        return "outline";
    }
  };

  const getPriorityVariant = (priority: string | null) => {
    switch (priority) {
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "default";
      case "LOW":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="overflow-x-auto max-h-[calc(100vh-32rem)] overflow-y-auto">
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
              Status
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Priority
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Start Date
            </th>
            <th className="pb-3 text-left text-sm font-medium text-muted-foreground">
              Finish Date
            </th>
            <th className="pb-3 text-right text-sm font-medium text-muted-foreground">
              Budget
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {projects.map((project) => (
            <tr
              key={project.id}
              onClick={() => router.push(`/projects/${project.id}`)}
              className="group hover:bg-muted/50 cursor-pointer"
            >
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-primary/10 flex items-center justify-center">
                    <FolderKanban className="h-5 w-5 text-primary" />
                  </Avatar>
                  <div>
                    <p className="font-medium">{project.name}</p>
                    {project.description && (
                      <p className="text-sm text-muted-foreground max-w-xs truncate">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-4">
                <p className="text-sm">{project.type || "-"}</p>
              </td>
              <td className="py-4">
                <Badge variant={getStatusVariant(project.status)}>
                  {project.status.replace("_", " ")}
                </Badge>
              </td>
              <td className="py-4">
                {project.priority && (
                  <Badge variant={getPriorityVariant(project.priority)}>
                    {project.priority}
                  </Badge>
                )}
              </td>
              <td className="py-4">
                <p className="text-sm">{formatDate(project.startDate)}</p>
              </td>
              <td className="py-4">
                <p className="text-sm">{formatDate(project.finishDate)}</p>
              </td>
              <td className="py-4 text-right">
                <p className="font-medium">
                  ${Number(project.budget || 0).toLocaleString()}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
