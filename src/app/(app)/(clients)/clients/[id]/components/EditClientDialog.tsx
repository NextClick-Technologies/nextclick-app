"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateClient } from "@/hooks/useClient";
import { useCompanies } from "@/hooks/useCompany";
import { Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateClientSchema,
  type UpdateClientInput,
} from "@/schemas/client.schema";
import { Client, ClientStatus } from "@/types";
import { FormField } from "../../components/add-client-dialog/FormField";
import { ClientSelectFields } from "../../components/add-client-dialog/ClientSelectFields";
import { useEffect } from "react";

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
      companyId: client.companyId || undefined,
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
      companyId: client.companyId || undefined,
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
          <div className="space-y-4 p-2 overflow-y-auto flex-1">
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

            <div className="space-y-2">
              <Label htmlFor="totalContractValue">Total Contract Value</Label>
              <Input
                type="number"
                id="totalContractValue"
                placeholder="0"
                {...register("totalContractValue", { valueAsNumber: true })}
                className={
                  errors.totalContractValue ? "border-destructive" : ""
                }
              />
              {errors.totalContractValue && (
                <p className="text-sm text-destructive">
                  {errors.totalContractValue.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date</Label>
              <Input
                type="date"
                id="joinDate"
                {...register("joinDate")}
                className={errors.joinDate ? "border-destructive" : ""}
              />
              {errors.joinDate && (
                <p className="text-sm text-destructive">
                  {errors.joinDate.message}
                </p>
              )}
            </div>

            <Controller
              name="companyId"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="companyId">Company (Optional)</Label>
                  <Select
                    value={field.value ?? "no-company"}
                    onValueChange={(value) =>
                      field.onChange(value === "no-company" ? undefined : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-company">No Company</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.companyId && (
                    <p className="text-sm text-destructive">
                      {errors.companyId.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ClientStatus.ACTIVE}>
                        Active
                      </SelectItem>
                      <SelectItem value={ClientStatus.INACTIVE}>
                        Inactive
                      </SelectItem>
                      <SelectItem value={ClientStatus.PENDING}>
                        Pending
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-sm text-destructive">
                      {errors.status.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="flex gap-2 p-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || updateClient.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting || updateClient.isPending}
            >
              {(isSubmitting || updateClient.isPending) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
