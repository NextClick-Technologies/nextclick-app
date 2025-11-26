"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectHeaderProps {
  onAddClick: () => void;
}

export function ProjectHeader({ onAddClick }: ProjectHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Project Management
        </h1>
        <p className="text-muted-foreground">
          Manage and track all your projects
        </p>
      </div>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add New Project
      </Button>
    </div>
  );
}
