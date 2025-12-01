"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useCreateCompany } from "@/features/companies/ui/hooks/useCompany";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  companySchema,
  type CompanyInput,
} from "@/features/companies/domain/schemas";
import { FormField } from "./FormField";

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCompanyDialog({
  open,
  onOpenChange,
}: AddCompanyDialogProps) {
  const createCompany = useCreateCompany();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CompanyInput>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      contactPerson: undefined,
      industry: undefined,
    },
  });

  const onSubmit = async (data: CompanyInput) => {
    try {
      await createCompany.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create company:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
          <FormField
            label="Company Name"
            id="name"
            placeholder="Enter company name"
            register={register}
            error={errors.name}
          />

          <FormField
            label="Email"
            id="email"
            type="email"
            placeholder="company@example.com"
            register={register}
            error={errors.email}
          />

          <FormField
            label="Phone Number"
            id="phoneNumber"
            placeholder="+1234567890"
            register={register}
            error={errors.phoneNumber}
          />

          <FormField
            label="Address"
            id="address"
            placeholder="Enter company address"
            register={register}
            error={errors.address}
          />

          <FormField
            label="Contact Person (Optional)"
            id="contactPerson"
            placeholder="Enter contact person name"
            register={register}
            error={errors.contactPerson}
          />

          <FormField
            label="Industry (Optional)"
            id="industry"
            placeholder="e.g., Technology, Healthcare"
            register={register}
            error={errors.industry}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || createCompany.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || createCompany.isPending}
            >
              {(isSubmitting || createCompany.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Company
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
