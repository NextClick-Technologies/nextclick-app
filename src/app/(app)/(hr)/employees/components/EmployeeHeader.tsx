"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmployeeHeaderProps {
  onAddClick: () => void;
}

export function EmployeeHeader({ onAddClick }: EmployeeHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Employee Management
        </h1>
        <p className="text-muted-foreground">
          Manage your team members and track their information
        </p>
      </div>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add New Employee
      </Button>
    </div>
  );
}
