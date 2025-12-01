"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/shared/components/layout/AppLayout";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useCompany, useDeleteCompany } from "../hooks/useCompany";
import { CompanyDetailHeader } from "../components/[id]/CompanyDetailHeader";
import { CompanyInformation } from "../components/[id]/CompanyInformation";
import { ClientsSummary } from "../components/[id]/ClientsSummary";
import { EditCompanyDialog } from "../components/[id]/edit-company-dialog";
import { DeleteCompanyDialog } from "../components/[id]/DeleteCompanyDialog";

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
      <div className="space-y-6">
        <CompanyDetailHeader
          companyName={company.name}
          onBack={handleBack}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-2">
            <CompanyInformation
              email={company.email}
              phoneNumber={company.phoneNumber}
              address={company.address}
              contactPerson={company.contactPerson}
              industry={company.industry}
              status={company.status}
            />
          </div>

          {/* Right Column - Clients Summary */}
          <div>
            <ClientsSummary />
          </div>
        </div>
      </div>

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
