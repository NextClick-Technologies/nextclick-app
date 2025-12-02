"use client";

import { TeamMembers } from "./TeamMembers";
import { formatDate } from "./projectInfoUtils";
import { sanitizeHtml } from "@/shared/utils/sanitize";

interface TeamMember {
  id: string;
  name: string;
  familyName: string;
  role?: string | null;
}

interface ProjectDatesAndDetailsProps {
  startDate: string | null;
  finishDate: string | null;
  completionDate: string | null;
  description: string | null;
  members: TeamMember[];
  onManageTeam: () => void;
}

export function ProjectDatesAndDetails({
  startDate,
  finishDate,
  completionDate,
  description,
  members,
  onManageTeam,
}: ProjectDatesAndDetailsProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Start Date:</p>
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
          <div
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }}
          />
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Team Members:
        </p>
        <div className="mt-2">
          <TeamMembers members={members} onManageTeam={onManageTeam} />
        </div>
      </div>
    </div>
  );
}
