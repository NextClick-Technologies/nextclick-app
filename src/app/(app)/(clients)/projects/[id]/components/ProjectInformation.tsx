"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProjectStatus, ProjectPriority } from "@/types";
import { TeamMembers } from "./TeamMembers";
import { ManageTeamDialog } from "./ManageTeamDialog";

interface TeamMember {
  id: string;
  name: string;
  familyName: string;
  role?: string | null;
}

interface ProjectInformationProps {
  projectId: string;
  type: string | null;
  status: ProjectStatus;
  priority: ProjectPriority | null;
  startDate: string | null;
  finishDate: string | null;
  completionDate: string | null;
  description: string | null;
  clientName: string;
  projectManagerName: string | null;
  members?: TeamMember[];
}

export function ProjectInformation({
  projectId,
  type,
  status,
  priority,
  startDate,
  finishDate,
  completionDate,
  description,
  clientName,
  projectManagerName,
  members = [],
}: ProjectInformationProps) {
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);

  const getStatusVariant = (
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

  const getPriorityVariant = (
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

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
            <span className="text-xs">📋</span>
          </div>
          <h2 className="text-lg font-semibold">Project Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Client:
              </p>
              <p className="text-sm">{clientName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Project Manager:
              </p>
              <p className="text-sm">{projectManagerName || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Team Members:
              </p>
              <div className="mt-2">
                <TeamMembers
                  members={members}
                  onManageTeam={() => setIsManageTeamOpen(true)}
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Type:</p>
              <p className="text-sm">{type || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status:
              </p>
              <div className="mt-1">
                <Badge variant={getStatusVariant(status)}>
                  {status.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Priority:
              </p>
              <div className="mt-1">
                <Badge variant={getPriorityVariant(priority)}>
                  {priority?.toUpperCase() || "N/A"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Start Date:
              </p>
              <p className="text-sm">{formatDate(startDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Finish Date:
              </p>
              <p className="text-sm">{formatDate(finishDate)}</p>
            </div>
            {completionDate && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completion Date:
                </p>
                <p className="text-sm">{formatDate(completionDate)}</p>
              </div>
            )}
            {description && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Description:
                </p>
                <p className="text-sm">{description}</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <ManageTeamDialog
        open={isManageTeamOpen}
        onOpenChange={setIsManageTeamOpen}
        projectId={projectId}
        currentMembers={members}
      />
    </>
  );
}
