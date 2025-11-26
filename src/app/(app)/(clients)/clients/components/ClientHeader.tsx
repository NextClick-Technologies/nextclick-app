"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ClientHeaderProps {
  onAddClick: () => void;
}

export function ClientHeader({ onAddClick }: ClientHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Client Management</h1>
        <p className="text-muted-foreground">
          Manage your clients and track their projects
        </p>
      </div>
      <Button onClick={onAddClick}>
        <Plus className="h-4 w-4 mr-2" />
        Add New Client
      </Button>
    </div>
  );
}
