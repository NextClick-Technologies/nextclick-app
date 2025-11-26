"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useClient, useDeleteClient } from "@/hooks/useClient";
import { ClientDetailHeader } from "./components/ClientDetailHeader";
import { ContactInformation } from "./components/ContactInformation";
import { FinancialInformation } from "./components/FinancialInformation";
import { ProjectSummary } from "./components/ProjectSummary";
import { EditClientDialog } from "./components/edit-client-dialog";
import { DeleteClientDialog } from "./components/DeleteClientDialog";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, error, refetch } = useClient(clientId);
  const deleteClient = useDeleteClient();
  const client = data?.data;

  const handleBack = () => router.push("/clients");

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteClient.mutateAsync(clientId);
      router.push("/clients");
    } catch (error) {
      console.error("Failed to delete client:", error);
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

  if (error || !client) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-destructive">Error loading client details</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <ClientDetailHeader
          clientName={client.name}
          familyName={client.familyName}
          onBack={handleBack}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Contact Info */}
          <div className="lg:col-span-2">
            <ContactInformation
              email={client.email}
              phoneNumber={client.phoneNumber}
              contactPerson={`${client.name} ${client.familyName}`}
              status={client.status}
              joinDate={client.joinDate}
              companyName={client.company?.name || "N/A"}
            />
          </div>

          {/* Right Column - Financial & Project Summary */}
          <div className="space-y-6">
            <FinancialInformation
              totalContractValue={client.totalContractValue}
            />
            <ProjectSummary />
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <EditClientDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        client={client}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Dialog */}
      <DeleteClientDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        clientName={`${client.name} ${client.familyName}`}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteClient.isPending}
      />
    </AppLayout>
  );
}
