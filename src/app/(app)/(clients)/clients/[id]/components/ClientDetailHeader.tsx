"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

interface ClientDetailHeaderProps {
  clientName: string;
  familyName: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ClientDetailHeader({
  clientName,
  familyName,
  onBack,
  onEdit,
  onDelete,
}: ClientDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {clientName} {familyName}
          </h1>
          <p className="text-muted-foreground">Client Details</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
