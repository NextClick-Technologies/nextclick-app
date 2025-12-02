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
import { useClient, useDeleteClient } from "../hooks/useClient";
import { ClientDetailHeader } from "../components/[client-detail-page]/ClientDetailHeader";
import { ContactInformation } from "../components/[client-detail-page]/ContactInformation";
import { FinancialInformation } from "../components/[client-detail-page]/FinancialInformation";
import { ProjectSummary } from "../components/[client-detail-page]/ProjectSummary";
import { EditClientDialog } from "../components/[client-detail-page]/edit-client-dialog";
import { DeleteClientDialog } from "../components/[client-detail-page]/DeleteClientDialog";

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
              value="activity"
              className="px-4 py-2 data-[state=active]:bg-gray-50"
            >
              Activity
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          {/* Detail Tab */}
          <TabsContent value="detail" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - Contact Info */}
              <div className="lg:col-span-2">
                <ContactInformation
                  clientName={client.name}
                  familyName={client.familyName}
                  email={client.email}
                  phoneNumber={client.phoneNumber}
                  contactPerson={`${client.name} ${client.familyName}`}
                  status={client.status}
                  joinDate={client.joinDate}
                  companyName={client.company?.name || "N/A"}
                  companyId={client.company?.id || null}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
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
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="mt-6">
            <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">
              <p>Activity history coming soon...</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

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
