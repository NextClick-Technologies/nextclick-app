"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateCompany } from "@/hooks/useCompany";
import { Loader2 } from "lucide-react";
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
  const [formData, setFormData] = useState<CompanyFormData>(
    getInitialCompanyFormData()
  );

  const createCompany = useCreateCompany();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createCompany.mutateAsync({
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
      });

      setFormData(getInitialCompanyFormData());

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Company Name"
            id="name"
            placeholder="Enter company name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            required
          />

          <FormField
            label="Email (Optional)"
            id="email"
            type="email"
            placeholder="company@example.com"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
          />

          <FormField
            label="Phone Number (Optional)"
            id="phoneNumber"
            placeholder="+1234567890"
            value={formData.phoneNumber}
            onChange={(value) =>
              setFormData({ ...formData, phoneNumber: value })
            }
          />

          <FormField
            label="Address (Optional)"
            id="address"
            placeholder="Enter company address"
            value={formData.address}
            onChange={(value) => setFormData({ ...formData, address: value })}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={createCompany.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createCompany.isPending}
            >
              {createCompany.isPending && (
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
