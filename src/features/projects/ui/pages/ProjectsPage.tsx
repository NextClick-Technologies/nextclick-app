"use client";

import { useState, useMemo } from "react";
import { ProjectMetrics } from "../components/ProjectMetrics";
import { ProjectDatabase } from "../components/project-database";
import { AddProjectDialog } from "../components/add-project-dialog";
import { useProjects } from "../hooks/useProject";
import type { Project } from "../../domain/types";
import { AppLayout } from "@/shared/components/layout/AppLayout";

export default function ProjectsPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data, isLoading, error } = useProjects();

  const projects = useMemo(() => (data?.data || []) as Project[], [data?.data]);
  const totalProjects = data?.pagination?.total || projects.length;

  const filteredProjects = useMemo(() => {
    return projects.filter((project: Project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        project.type?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        project.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchQuery, statusFilter]);

  return (
    <AppLayout>
      <div className="space-y-4">
        <ProjectMetrics
          projects={projects}
          totalProjects={totalProjects}
          isLoading={isLoading}
        />
        <ProjectDatabase
          projects={filteredProjects}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          isLoading={isLoading}
          error={error}
          onAddClick={() => setIsAddDialogOpen(true)}
        />
        <AddProjectDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      </div>
    </AppLayout>
  );
}
