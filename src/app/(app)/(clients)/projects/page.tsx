"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useProjects } from "@/hooks/useProject";
import { AddProjectDialog } from "./components/add-project-dialog";
import { ProjectDatabase } from "./components/project-database";
import { ProjectHeader } from "./components/ProjectHeader";
import { ProjectMetrics } from "./components/ProjectMetrics";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [page] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useProjects({ page, pageSize });

  const projects = data?.data || [];
  const totalProjects = data?.pagination.total || 0;

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <ProjectHeader onAddClick={() => setIsAddDialogOpen(true)} />

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
        />
      </div>

      <AddProjectDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </AppLayout>
  );
}
