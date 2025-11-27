"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

interface EmployeeDetailHeaderProps {
  employeeName: string;
  familyName: string;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function EmployeeDetailHeader({
  employeeName,
  familyName,
  onBack,
  onEdit,
  onDelete,
}: EmployeeDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-4 items-start">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {employeeName} {familyName}
          </h1>
          <p className="text-muted-foreground">Employee Details</p>
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
