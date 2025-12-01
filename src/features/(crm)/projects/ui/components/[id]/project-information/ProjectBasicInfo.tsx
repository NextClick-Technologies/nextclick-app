"use client";

import { Badge } from "@/components/ui/badge";
import {
  ProjectStatus,
  ProjectPriority,
} from "@/features/(crm)/projects/services/types";
import { getStatusVariant, getPriorityVariant } from "./projectInfoUtils";

interface ProjectBasicInfoProps {
  clientName: string;
  projectManagerName: string | null;
  type: string | null;
  status: ProjectStatus;
  priority: ProjectPriority | null;
}

export function ProjectBasicInfo({
  clientName,
  projectManagerName,
  type,
  status,
  priority,
}: ProjectBasicInfoProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Client:</p>
        <p className="text-sm">{clientName}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Project Manager:
        </p>
        <p className="text-sm">{projectManagerName || "N/A"}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Type:</p>
        <p className="text-sm">{type || "N/A"}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Status:</p>
        <div className="mt-1">
          <Badge variant={getStatusVariant(status)}>
            {status.replace("_", " ").toUpperCase()}
          </Badge>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-muted-foreground">Priority:</p>
        <div className="mt-1">
          <Badge variant={getPriorityVariant(priority)}>
            {priority?.toUpperCase() || "N/A"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
