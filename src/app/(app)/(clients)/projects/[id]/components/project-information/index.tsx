"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProjectStatus, ProjectPriority } from "@/types";
import { ManageTeamDialog } from "./ManageTeamDialog";
import { ProjectInfoHeader } from "./ProjectInfoHeader";
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

  return (
    <>
      <Card className="p-6">
        <ProjectInfoHeader />
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
