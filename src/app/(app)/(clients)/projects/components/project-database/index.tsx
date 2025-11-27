"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Project } from "@/types";
import { ProjectTable } from "./ProjectTable";
import { ProjectFilters } from "./ProjectFilters";

interface ProjectDatabaseProps {
  projects: Project[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  isLoading: boolean;
  error: Error | null;
  onAddClick: () => void;
}

export function ProjectDatabase({
  projects,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  isLoading,
  error,
  onAddClick,
}: ProjectDatabaseProps) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold sm:text-xl">Project Database</h2>
          <div className="flex flex-col gap-2 w-full sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <Button
              onClick={onAddClick}
              size="sm"
              className="hidden sm:flex sm:shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add New Project
            </Button>
            <ProjectFilters
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
              statusFilter={statusFilter}
              onStatusChange={onStatusChange}
            />
          </div>
        </div>
        <Button onClick={onAddClick} className="w-full sm:hidden">
          <Plus className="h-4 w-4 mr-2" />
          Add New Project
        </Button>

        {error && (
          <div className="text-center py-8 text-destructive">
            Error loading projects: {error.message}
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && !error && <ProjectTable projects={projects} />}

        {!isLoading && !error && projects.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No projects found
          </div>
        )}
      </div>
    </Card>
  );
}
