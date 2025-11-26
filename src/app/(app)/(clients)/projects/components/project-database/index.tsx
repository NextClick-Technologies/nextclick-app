"use client";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
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
}

export function ProjectDatabase({
  projects,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  isLoading,
  error,
}: ProjectDatabaseProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Project Database</h2>
          <ProjectFilters
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            statusFilter={statusFilter}
            onStatusChange={onStatusChange}
          />
        </div>

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
