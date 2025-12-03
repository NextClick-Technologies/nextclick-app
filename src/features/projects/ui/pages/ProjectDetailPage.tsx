"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/shared/components/layout/AppLayout";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useProject, useDeleteProject } from "../hooks/useProject";
import { ProjectInformation } from "../components/[project-detail-page]/project-information";
import { BudgetInformation } from "../components/[project-detail-page]/BudgetInformation";
import { ProjectMilestones } from "../components/[project-detail-page]/(milestones)/project-milestones";
import { MilestoneStats } from "../components/[project-detail-page]/(milestones)/milestone-progress";
import { EditProjectDialog } from "../components/[project-detail-page]/edit-project-dialog";
import { DeleteProjectDialog } from "../components/[project-detail-page]/DeleteProjectDialog";

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
      <Tabs
        defaultValue="detail"
        className="flex flex-col -mx-4 -my-4 sm:-mx-6 sm:-my-6 h-[calc(100vh-5rem)]"
      >
        {/* Tabs Header - Fixed */}
        <div className="shrink-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6 bg-background border-b">
          <TabsList className="bg-transparent h-auto p-0">
            <TabsTrigger
              value="detail"
              className="px-4 py-2 data-[state=active]:bg-gray-50 border-none"
            >
              Detail
            </TabsTrigger>
            <TabsTrigger
              value="milestones"
              className="px-4 py-2 data-[state=active]:bg-gray-50 border-none"
            >
              Milestones
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          {/* Detail Tab */}
          <TabsContent value="detail" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <ProjectInformation
                  projectId={projectId}
                  projectName={project.name}
                  type={project.type}
                  status={project.status}
                  priority={project.priority}
                  startDate={project.startDate}
                  finishDate={project.finishDate}
                  completionDate={project.completionDate}
                  description={project.description}
                  clientName={clientName}
                  projectManagerName={projectManagerName}
                  members={project.members}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>

              <div>
                <BudgetInformation
                  budget={project.budget}
                  paymentTerms={project.paymentTerms}
                />
              </div>
            </div>
          </TabsContent>

          {/* Milestones Tab */}
          <TabsContent value="milestones" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <ProjectMilestones
                  projectId={projectId}
                  projectMembers={project.members || []}
                />
              </div>

              <div className="lg:col-span-3">
                <MilestoneStats projectId={projectId} />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

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
