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
import { useCompany, useDeleteCompany } from "../hooks/useCompany";
import { CompanyDetailHeader } from "../components/[company-detail-page]/CompanyDetailHeader";
import { CompanyInformation } from "../components/[company-detail-page]/CompanyInformation";
import { ClientsSummary } from "../components/[company-detail-page]/ClientsSummary";
import { EditCompanyDialog } from "../components/[company-detail-page]/edit-company-dialog";
import { DeleteCompanyDialog } from "../components/[company-detail-page]/DeleteCompanyDialog";

export default function CompanyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, error, refetch } = useCompany(companyId);
  const deleteCompany = useDeleteCompany();
  const company = data?.data;

  const handleBack = () => router.push("/companies");

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCompany.mutateAsync(companyId);
      router.push("/companies");
    } catch (error) {
      console.error("Failed to delete company:", error);
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

  if (error || !company) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Company Not Found</h2>
            <p className="text-muted-foreground">
              {error
                ? "Error loading company details"
                : "The company you're looking for doesn't exist"}
            </p>
          </div>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Tabs
        defaultValue="detail"
        className="flex flex-col -mx-4 -my-4 sm:-mx-6 sm:-my-6 h-[calc(100vh-5rem)]"
      >
        {/* Tabs Header - Fixed */}
        <div className="shrink-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6 bg-background">
          <TabsList className="bg-transparent h-auto p-0 gap-2">
            <TabsTrigger
              value="detail"
              className="px-4 py-2 data-[state=active]:bg-gray-50"
            >
              Detail
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="px-4 py-2 data-[state=active]:bg-gray-50"
            >
              Projects
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          {/* Detail Tab */}
          <TabsContent value="detail" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - Company Info */}
              <div className="lg:col-span-2">
                <CompanyInformation
                  companyName={company.name}
                  email={company.email}
                  phoneNumber={company.phoneNumber}
                  address={company.address}
                  contactPerson={company.contactPerson}
                  industry={company.industry}
                  status={company.status}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>

              {/* Right Column - Clients Summary */}
              <div>
                <ClientsSummary />
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="mt-6">
            <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">
              <p>Projects overview coming soon...</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Edit Dialog */}
      <EditCompanyDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        company={company}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Dialog */}
      <DeleteCompanyDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        companyName={company.name}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteCompany.isPending}
      />
    </AppLayout>
  );
}
