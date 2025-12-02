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
import { useEmployee, useDeleteEmployee } from "../hooks/useEmployee";
import { EmployeeDetailHeader } from "../components/[employee-detail-page]/EmployeeDetailHeader";
import { PersonalInformation } from "../components/[employee-detail-page]/PersonalInformation";
import { ContactInformation } from "../components/[employee-detail-page]/ContactInformation";
import { EmploymentInformation } from "../components/[employee-detail-page]/EmploymentInformation";
import { AddressInformation } from "../components/[employee-detail-page]/AddressInformation";
import { EditEmployeeDialog } from "../components/[employee-detail-page]/edit-employee-dialog";
import { DeleteEmployeeDialog } from "../components/[employee-detail-page]/DeleteEmployeeDialog";

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params.id as string;

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data, isLoading, error, refetch } = useEmployee(employeeId);
  const deleteEmployee = useDeleteEmployee();
  const employee = data?.data;

  const handleBack = () => router.push("/employees");

  const handleEdit = () => {
    setIsEditDialogOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEmployee.mutateAsync(employeeId);
      router.push("/employees");
    } catch (error) {
      console.error("Failed to delete employee:", error);
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

  if (error || !employee) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-destructive">Error loading employee details</p>
          {error && (
            <p className="text-sm text-muted-foreground">{error.message}</p>
          )}
          {!employee && !error && (
            <p className="text-sm text-muted-foreground">Employee not found</p>
          )}
          <Button onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Employees
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
              value="performance"
              className="px-4 py-2 data-[state=active]:bg-gray-50"
            >
              Performance
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          {/* Detail Tab */}
          <TabsContent value="detail" className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                <PersonalInformation
                  title={employee.title}
                  name={employee.name}
                  familyName={employee.familyName}
                  preferredName={employee.preferredName}
                  gender={employee.gender}
                  photo={employee.photo}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />

                <ContactInformation
                  email={employee.email}
                  phoneNumber={employee.phoneNumber}
                  emergencyContact={employee.emergencyContact}
                  emergencyPhone={employee.emergencyPhone}
                />

                <AddressInformation
                  address={employee.address}
                  city={employee.city}
                  state={employee.state}
                  zipCode={employee.zipCode}
                  country={employee.country}
                />
              </div>

              {/* Right Column - Employment Info */}
              <div>
                <EmploymentInformation
                  status={employee.status}
                  department={employee.department}
                  position={employee.position}
                  joinDate={employee.joinDate}
                  createdAt={employee.createdAt}
                />
              </div>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="mt-6">
            <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground">
              <p>Performance metrics coming soon...</p>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {employee && (
        <>
          <EditEmployeeDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            employee={employee}
            onSuccess={handleEditSuccess}
          />

          <DeleteEmployeeDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            employeeName={`${employee.name} ${employee.familyName}`}
            onConfirm={handleConfirmDelete}
            isDeleting={deleteEmployee.isPending}
          />
        </>
      )}
    </AppLayout>
  );
}
