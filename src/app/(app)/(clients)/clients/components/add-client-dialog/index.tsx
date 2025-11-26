"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateClient } from "@/hooks/useClient";
import { useCompanies } from "@/hooks/useCompany";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSchema, type ClientInput } from "@/schemas/client.schema";
import { FormField } from "./FormField";
import { ClientSelectFields } from "./ClientSelectFields";
import { CompanySelect } from "./CompanySelect";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const createClient = useCreateClient();
  const { data: companiesData } = useCompanies({ pageSize: 100 });
  const companies = companiesData?.data || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = async (data: ClientInput) => {
    try {
      await createClient.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create client:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-2">
          <ClientSelectFields control={control} />

          <FormField
            label="First Name"
            id="name"
            placeholder="Enter first name"
            register={register}
            error={errors.name}
          />

          <FormField
            label="Family Name"
            id="familyName"
            placeholder="Enter family name"
            register={register}
            error={errors.familyName}
          />

          <FormField
            label="Phone Number"
            id="phoneNumber"
            placeholder="+1234567890"
            register={register}
            error={errors.phoneNumber}
          />

          <FormField
            label="Email (Optional)"
            id="email"
            type="email"
            placeholder="email@example.com"
            register={register}
          />

          <CompanySelect
            control={control}
            companies={companies}
            error={errors.companyId}
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || createClient.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || createClient.isPending}
            >
              {(isSubmitting || createClient.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Client
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
