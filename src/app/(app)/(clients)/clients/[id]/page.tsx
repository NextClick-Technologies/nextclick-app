"use client";

import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useClient } from "@/hooks/useClient";
import { ClientDetailHeader } from "./components/ClientDetailHeader";
import { ContactInformation } from "./components/ContactInformation";
import { CompanyDetails } from "./components/CompanyDetails";
import { FinancialInformation } from "./components/FinancialInformation";
import { ProjectSummary } from "./components/ProjectSummary";

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const { data, isLoading, error } = useClient(clientId);
  const client = data?.data;

  const handleBack = () => router.push("/clients");
  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log("Edit client:", clientId);
  };
  const handleDelete = () => {
    // TODO: Implement delete functionality
    console.log("Delete client:", clientId);
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
          {/* Left Column - Contact & Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <ContactInformation
              email={client.email}
              phoneNumber={client.phoneNumber}
              contactPerson={`${client.name} ${client.familyName}`}
            />
            <CompanyDetails joinDate={client.joinDate} status={client.status} />
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
    </AppLayout>
  );
}
