"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateCompany } from "@/hooks/useCompany";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { FormField } from "./FormField";
import { getInitialCompanyFormData, type CompanyFormData } from "./types";

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
  } = useForm<CompanyFormData>({
    defaultValues: getInitialCompanyFormData(),
  });

  const onSubmit = async (data: CompanyFormData) => {
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            label="Company Name"
            id="name"
            placeholder="Enter company name"
            register={register}
            error={errors.name}
            validation={{
              required: "Company name is required",
              minLength: {
                value: 2,
                message: "Company name must be at least 2 characters",
              },
            }}
          />

          <FormField
            label="Email (Optional)"
            id="email"
            type="email"
            placeholder="company@example.com"
            register={register}
          />

          <FormField
            label="Phone Number (Optional)"
            id="phoneNumber"
            placeholder="+1234567890"
            register={register}
          />

          <FormField
            label="Address (Optional)"
            id="address"
            placeholder="Enter company address"
            register={register}
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
