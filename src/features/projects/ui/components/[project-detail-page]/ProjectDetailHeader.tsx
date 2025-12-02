"use client";

import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

interface ProjectDetailHeaderProps {
  projectName: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectDetailHeader({
  projectName,
  onBack,
  onEdit,
  onDelete,
}: ProjectDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-4 items-start">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{projectName}</h1>
          <p className="text-muted-foreground">Project Details</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}
