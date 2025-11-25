"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateClient } from "@/hooks/useClient";
import { Loader2 } from "lucide-react";
import { FormField } from "./FormField";
import { ClientSelectFields } from "./ClientSelectFields";
import { getInitialClientFormData, type ClientFormData } from "./types";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddClientDialog({ open, onOpenChange }: AddClientDialogProps) {
  const [formData, setFormData] = useState<ClientFormData>(
    getInitialClientFormData()
  );

  const createClient = useCreateClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createClient.mutateAsync({
        title: formData.title,
        name: formData.name,
        familyName: formData.familyName,
        gender: formData.gender,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      });

      setFormData(getInitialClientFormData());

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <ClientSelectFields
            title={formData.title}
            gender={formData.gender}
            onTitleChange={(value) =>
              setFormData({ ...formData, title: value })
            }
            onGenderChange={(value) =>
              setFormData({ ...formData, gender: value })
            }
          />

          <FormField
            label="First Name"
            id="name"
            placeholder="Enter first name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            required
          />

          <FormField
            label="Family Name"
            id="familyName"
            placeholder="Enter family name"
            value={formData.familyName}
            onChange={(value) =>
              setFormData({ ...formData, familyName: value })
            }
            required
          />

          <FormField
            label="Phone Number"
            id="phoneNumber"
            placeholder="+1234567890"
            value={formData.phoneNumber}
            onChange={(value) =>
              setFormData({ ...formData, phoneNumber: value })
            }
            required
          />

          <FormField
            label="Email (Optional)"
            id="email"
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={createClient.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createClient.isPending}
            >
              {createClient.isPending && (
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
