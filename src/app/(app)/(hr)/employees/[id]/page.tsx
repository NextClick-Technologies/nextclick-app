"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AppLayout } from "@/shared/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  useEmployee,
  useDeleteEmployee,
} from "@/features/(hr)/employees/ui/hooks";
import { EmployeeDetailHeader } from "./components/EmployeeDetailHeader";
import { PersonalInformation } from "./components/PersonalInformation";
import { ContactInformation } from "./components/ContactInformation";
import { EmploymentInformation } from "./components/EmploymentInformation";
import { AddressInformation } from "./components/AddressInformation";
import { EditEmployeeDialog } from "./components/edit-employee-dialog";
import { DeleteEmployeeDialog } from "./components/DeleteEmployeeDialog";

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
      <div className="space-y-6">
        <EmployeeDetailHeader
          employeeName={employee.name}
          familyName={employee.familyName}
          onBack={handleBack}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

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
      </div>

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
