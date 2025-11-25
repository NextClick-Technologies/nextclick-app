"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/hooks/useProject";
import { useClients } from "@/hooks/useClient";
import { Loader2 } from "lucide-react";
import { PaymentTerms, ProjectStatus, ProjectPriority } from "@/const";
import { FormField } from "./FormField";
import { ClientSelect } from "./ClientSelect";
import { ProjectSelectFields } from "./ProjectSelectFields";
import { DescriptionField } from "./DescriptionField";
import { getInitialFormData, type ProjectFormData } from "./types";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProjectDialog({
  open,
  onOpenChange,
}: AddProjectDialogProps) {
  const [formData, setFormData] = useState<ProjectFormData>(
    getInitialFormData()
  );

  const createProject = useCreateProject();
  const { data: clientsData } = useClients({ pageSize: 100 });
  const clients = clientsData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createProject.mutateAsync({
        name: formData.name,
        type: formData.type,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : new Date().toISOString(),
        finishDate: formData.finishDate
          ? new Date(formData.finishDate).toISOString()
          : new Date().toISOString(),
        budget: formData.budget,
        paymentTerms:
          formData.paymentTerms as (typeof PaymentTerms)[keyof typeof PaymentTerms],
        status:
          formData.status as (typeof ProjectStatus)[keyof typeof ProjectStatus],
        priority:
          formData.priority as (typeof ProjectPriority)[keyof typeof ProjectPriority],
        description: formData.description,
        clientId: formData.clientId,
      });

      setFormData(getInitialFormData());

      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create project:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Project Name"
            id="name"
            placeholder="Enter project name"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            required
          />

          <ClientSelect
            value={formData.clientId}
            clients={clients}
            onChange={(value) => setFormData({ ...formData, clientId: value })}
            required
          />

          <FormField
            label="Type (Optional)"
            id="type"
            placeholder="e.g., web-development, mobile-app"
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Date (Optional)"
              id="startDate"
              type="date"
              placeholder=""
              value={formData.startDate}
              onChange={(value) =>
                setFormData({ ...formData, startDate: value })
              }
            />

            <FormField
              label="Finish Date (Optional)"
              id="finishDate"
              type="date"
              placeholder=""
              value={formData.finishDate}
              onChange={(value) =>
                setFormData({ ...formData, finishDate: value })
              }
            />
          </div>

          <FormField
            label="Budget (Optional)"
            id="budget"
            type="number"
            placeholder="0"
            value={formData.budget}
            onChange={(value) => setFormData({ ...formData, budget: value })}
          />

          <ProjectSelectFields
            paymentTerms={formData.paymentTerms}
            status={formData.status}
            priority={formData.priority}
            onPaymentTermsChange={(value) =>
              setFormData({ ...formData, paymentTerms: value })
            }
            onStatusChange={(value) =>
              setFormData({ ...formData, status: value })
            }
            onPriorityChange={(value) =>
              setFormData({ ...formData, priority: value })
            }
          />

          <DescriptionField
            value={formData.description}
            onChange={(value) =>
              setFormData({ ...formData, description: value })
            }
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={createProject.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createProject.isPending}
            >
              {createProject.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Add Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
