"use client";

import { useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  ProjectStatus,
  ProjectPriority,
} from "@/features/projects/domain/types";
import { ManageTeamDialog } from "./ManageTeamDialog";
import { ProjectBasicInfo } from "./ProjectBasicInfo";
import { ProjectDatesAndDetails } from "./ProjectDatesAndDetails";

interface TeamMember {
  id: string;
  name: string;
  familyName: string;
  role?: string | null;
}

interface ProjectInformationProps {
  projectId: string;
  projectName: string;
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
  onEdit: () => void;
  onDelete: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function ProjectInformation({
  projectId,
  projectName,
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
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: ProjectInformationProps) {
  const [isManageTeamOpen, setIsManageTeamOpen] = useState(false);

  return (
    <>
      <Card className="p-6">
        {/* Header with Project Name and Action Buttons */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-4 sm:mb-0">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
                <span className="text-xs">📋</span>
              </div>
              <h2 className="text-lg font-semibold">{projectName}</h2>
            </div>
            {(canEdit || canDelete) && (
              <div className="hidden sm:flex items-center gap-2">
                {canEdit && (
                  <Button variant="outline" size="sm" onClick={onEdit}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}
                {canDelete && (
                  <Button variant="destructive" size="sm" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </div>
            )}
          </div>
          {(canEdit || canDelete) && (
            <div className="flex sm:hidden items-center gap-2">
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEdit}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onDelete}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProjectBasicInfo
            clientName={clientName}
            projectManagerName={projectManagerName}
            type={type}
            status={status}
            priority={priority}
          />
          <ProjectDatesAndDetails
            startDate={startDate}
            finishDate={finishDate}
            completionDate={completionDate}
            description={description}
            members={members}
            onManageTeam={() => setIsManageTeamOpen(true)}
          />
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
