"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ClientHeaderProps {
  onAddClick: () => void;
}

export function ClientHeader({ onAddClick }: ClientHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Client Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage your clients and track their projects
        </p>
      </div>
      <Button onClick={onAddClick} className="w-full sm:w-auto">
        <Plus className="h-4 w-4 mr-2" />
        Add New Client
      </Button>
    </div>
  );
}
