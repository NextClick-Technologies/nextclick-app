"use client";

import { Card } from "@/shared/components/ui/card";
import { Users } from "lucide-react";

export function ClientsSummary() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
          <Users className="h-3 w-3 text-primary" />
        </div>
        <h2 className="text-lg font-semibold">Clients Summary</h2>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Total Clients</p>
          <p className="text-2xl font-bold">-</p>
        </div>
        <div className="text-xs text-muted-foreground">
          View all clients associated with this company
        </div>
      </div>
    </Card>
  );
}
