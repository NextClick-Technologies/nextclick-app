"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useProject, useDeleteProject } from "@/hooks/useProject";
import { ProjectDetailHeader } from "./components/ProjectDetailHeader";
import { ProjectInformation } from "./components/ProjectInformation";
import { BudgetInformation } from "./components/BudgetInformation";
import { EditProjectDialog } from "./components/edit-project-dialog";
import { DeleteProjectDialog } from "./components/DeleteProjectDialog";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, error, refetch } = useProject(projectId);
  const deleteProject = useDeleteProject();
  const project = data?.data;

  const handleBack = () => router.push("/projects");

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteProject.mutateAsync(projectId);
      router.push("/projects");
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const handleEditSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  if (error || !project) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Project Not Found</h2>
            <p className="text-muted-foreground">
              {error
                ? "Error loading project details"
                : "The project you're looking for doesn't exist"}
            </p>
          </div>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </AppLayout>
    );
  }

  const clientName = project.client
    ? `${project.client.name} ${project.client.familyName}`
    : "N/A";

  const projectManagerName = project.employee
    ? `${project.employee.name} ${project.employee.familyName}`
    : null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <ProjectDetailHeader
          projectName={project.name}
          onBack={handleBack}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Project Info */}
          <div className="lg:col-span-2">
            <ProjectInformation
              type={project.type}
              status={project.status}
              priority={project.priority}
              startDate={project.startDate}
              finishDate={project.finishDate}
              completionDate={project.completionDate}
              description={project.description}
              clientName={clientName}
              projectManagerName={projectManagerName}
            />
          </div>

          {/* Right Column - Budget Info */}
          <div>
            <BudgetInformation
              budget={project.budget}
              paymentTerms={project.paymentTerms}
            />
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditProjectDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        project={project}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Dialog */}
      <DeleteProjectDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        projectName={project.name}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteProject.isPending}
      />
    </AppLayout>
  );
}
