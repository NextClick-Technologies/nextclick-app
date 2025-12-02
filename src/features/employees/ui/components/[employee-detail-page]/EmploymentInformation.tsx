"use client";

import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { EmployeeStatus } from "@/features/employees/domain/types";

interface EmploymentInformationProps {
  status: EmployeeStatus;
  department: string | null;
  position: string | null;
  joinDate: string | null;
  createdAt: string;
}

export function EmploymentInformation({
  status,
  department,
  position,
  joinDate,
  createdAt,
}: EmploymentInformationProps) {
  const getStatusVariant = (
    status: EmployeeStatus
  ): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case EmployeeStatus.ACTIVE:
        return "default";
      case EmployeeStatus.INACTIVE:
        return "secondary";
      case EmployeeStatus.ON_LEAVE:
        return "outline";
      case EmployeeStatus.TERMINATED:
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
          <span className="text-xs">💼</span>
        </div>
        <h2 className="text-lg font-semibold">Employment Information</h2>
      </div>
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Status:</p>
          <div className="mt-1">
            <Badge variant={getStatusVariant(status)}>
              {status.replace("_", " ").toUpperCase()}
            </Badge>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Department:
          </p>
          <p className="text-sm">{department || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Position:</p>
          <p className="text-sm">{position || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Join Date:
          </p>
          <p className="text-sm">
            {joinDate ? new Date(joinDate).toLocaleDateString() : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Created At:
          </p>
          <p className="text-sm">{new Date(createdAt).toLocaleDateString()}</p>
        </div>
      </div>
    </Card>
  );
}
