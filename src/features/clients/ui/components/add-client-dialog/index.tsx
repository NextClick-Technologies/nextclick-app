"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useCreateClient } from "../../hooks/useClient";
import { useCompanies } from "@/features/companies/ui/hooks/useCompany";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  clientSchema,
  type ClientInput,
} from "../../../domain/schemas";
import { FormField } from "./FormField";
import { ClientSelectFields } from "./ClientSelectFields";
import { CompanySelect } from "./CompanySelect";
import { JoinDateInput } from "./JoinDateInput";
import { StatusSelect } from "./StatusSelect";

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
    defaultValues: {
      joinDate: new Date().toISOString().split("T")[0],
      status: "active",
    },
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <CompanySelect
            control={control}
            companies={companies}
            error={errors.companyId}
          />

          <div className="grid grid-cols-2 gap-4">
            <JoinDateInput register={register} error={errors.joinDate} />
            <StatusSelect control={control} error={errors.status} />
          </div>

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
