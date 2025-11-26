"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClientStatus } from "@/types";

interface CompanyDetailsProps {
  joinDate: string | null;
  status: ClientStatus;
}

export function CompanyDetails({ joinDate, status }: CompanyDetailsProps) {
  const getStatusVariant = (
    status: ClientStatus
  ): "default" | "secondary" | "outline" => {
    switch (status) {
      case ClientStatus.ACTIVE:
        return "default";
      case ClientStatus.INACTIVE:
        return "secondary";
      case ClientStatus.PENDING:
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
          <span className="text-xs">🏢</span>
        </div>
        <h2 className="text-lg font-semibold">Company Details</h2>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Join Date:
          </p>
          <p className="text-sm">
            {joinDate ? new Date(joinDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status:</p>
          <div className="mt-1">
            <Badge variant={getStatusVariant(status)}>{status}</Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
