"use client";

import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";

interface ProjectHeaderProps {
  onAddClick: () => void;
}

export function ProjectHeader({ onAddClick }: ProjectHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Project Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage and track all your projects
        </p>
      </div>
      <Button onClick={onAddClick} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add New Project
      </Button>
    </div>
  );
}
