"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateClient } from "@/hooks/useClient";
import { useCompanies } from "@/hooks/useCompany";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateClientSchema,
  type UpdateClientInput,
} from "@/schemas/client.schema";
import { Client } from "@/types";
import { useEffect } from "react";
import { EditClientForm } from "./EditClientForm";
import { FormActions } from "./FormActions";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client;
  onSuccess?: () => void;
}

export function EditClientDialog({
  open,
  onOpenChange,
  client,
  onSuccess,
}: EditClientDialogProps) {
  const updateClient = useUpdateClient();
  const { data: companiesData } = useCompanies({ pageSize: 100 });
  const companies = companiesData?.data || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateClientInput>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      title: client.title,
      gender: client.gender,
      name: client.name,
      familyName: client.familyName,
      phoneNumber: client.phoneNumber,
      email: client.email || "",
      totalContractValue: client.totalContractValue ?? 0,
      joinDate: client.joinDate || undefined,
      companyId: client.companyId,
      status: client.status,
    },
  });

  // Reset form when client changes
  useEffect(() => {
    reset({
      title: client.title,
      gender: client.gender,
      name: client.name,
      familyName: client.familyName,
      phoneNumber: client.phoneNumber,
      email: client.email || "",
      totalContractValue: client.totalContractValue ?? 0,
      joinDate: client.joinDate || undefined,
      companyId: client.companyId,
      status: client.status,
    });
  }, [client, reset]);

  const onSubmit = async (data: UpdateClientInput) => {
    try {
      await updateClient.mutateAsync({ id: client.id, data });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update client:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 min-h-0"
        >
          <EditClientForm
            register={register}
            control={control}
            errors={errors}
            companies={companies}
          />

          <FormActions
            onCancel={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
            isPending={updateClient.isPending}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
}
