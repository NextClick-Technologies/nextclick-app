"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Company } from "@/features/companies/domain/types/company.type";
import { updateCompanySchema, UpdateCompanyInput } from "@/features/companies/domain/schemas/company.schema";
import { useUpdateCompany } from "@/features/companies/ui/hooks/useCompany";
import { EditCompanyForm } from "./EditCompanyForm";
import { FormActions } from "./FormActions";

interface EditCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company;
  onSuccess?: () => void;
}

export function EditCompanyDialog({
  open,
  onOpenChange,
  company,
  onSuccess,
}: EditCompanyDialogProps) {
  const updateCompany = useUpdateCompany();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateCompanyInput>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      name: company.name,
      email: company.email || "",
      phoneNumber: company.phoneNumber || "",
      address: company.address || "",
      contactPerson: company.contactPerson || "",
      industry: company.industry || "",
      status: company.status,
    },
  });

  // Reset form when company changes
  useEffect(() => {
    reset({
      name: company.name,
      email: company.email || "",
      phoneNumber: company.phoneNumber || "",
      address: company.address || "",
      contactPerson: company.contactPerson || "",
      industry: company.industry || "",
      status: company.status,
    });
  }, [company, reset]);

  const onSubmit = async (data: UpdateCompanyInput) => {
    try {
      await updateCompany.mutateAsync({ id: company.id, data });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update company:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="flex-1 overflow-y-auto px-1">
            <EditCompanyForm
              register={register}
              errors={errors}
              control={control}
            />
          </div>
          <FormActions
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
            isPending={updateCompany.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
