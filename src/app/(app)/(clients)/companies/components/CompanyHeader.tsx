"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface CompanyHeaderProps {
  onAddClick: () => void;
}

export function CompanyHeader({ onAddClick }: CompanyHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Company Management
        </h1>
        <p className="text-muted-foreground">
          Manage your company database and information
        </p>
      </div>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add New Company
      </Button>
    </div>
  );
}
