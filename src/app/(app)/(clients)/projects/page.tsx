"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useProjects } from "@/hooks/useProject";
import { AddProjectDialog } from "./components/add-project-dialog";
import { ProjectDatabase } from "./components/project-database";
import { ProjectStatus } from "@/types/project.type";

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

  const activeProjects = projects.filter(
    (p) => p.status === ProjectStatus.ACTIVE
  ).length;
  const completedProjects = projects.filter(
    (p) => p.status === ProjectStatus.COMPLETED
  ).length;
  const totalBudget = projects.reduce(
    (sum, p) => sum + Number(p.budget || 0),
    0
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Project Management
            </h1>
            <p className="text-muted-foreground">
              Manage and track all your projects
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Project
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Total Projects"
            value={totalProjects}
            isLoading={isLoading}
          />
          <MetricCard
            label="Active"
            value={activeProjects}
            badge={<Badge>{activeProjects}</Badge>}
            isLoading={isLoading}
          />
          <MetricCard
            label="Completed"
            value={completedProjects}
            badge={<Badge variant="secondary">{completedProjects}</Badge>}
            isLoading={isLoading}
          />
          <MetricCard
            label="Total Budget"
            value={`$${(totalBudget / 1000).toFixed(0)}K`}
            isLoading={isLoading}
          />
        </div>

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

function MetricCard({
  label,
  value,
  badge,
  isLoading,
}: {
  label: string;
  value: string | number;
  badge?: React.ReactNode;
  isLoading?: boolean;
}) {
  return (
    <Card className="p-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {badge}
        </div>
        {isLoading ? (
          <div className="h-8 w-20 bg-muted animate-pulse rounded" />
        ) : (
          <p className="text-2xl font-bold">{value}</p>
        )}
      </div>
    </Card>
  );
}
