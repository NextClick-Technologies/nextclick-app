"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

interface CompanyDetailHeaderProps {
  companyName: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function CompanyDetailHeader({
  companyName,
  onBack,
  onEdit,
  onDelete,
}: CompanyDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{companyName}</h1>
          <p className="text-muted-foreground">Company Details</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onEdit}>
          <Pencil className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </div>
    </div>
  );
}
