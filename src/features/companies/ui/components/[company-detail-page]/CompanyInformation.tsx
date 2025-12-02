"use client";

import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";

interface CompanyInformationProps {
  email: string | null;
  phoneNumber: string | null;
  address: string | null;
  contactPerson: string | null;
  industry: string | null;
  status: string;
}

export function CompanyInformation({
  email,
  phoneNumber,
  address,
  contactPerson,
  industry,
  status,
}: CompanyInformationProps) {
  const getStatusVariant = (
    status: string
  ): "default" | "secondary" | "outline" => {
    if (!status) return "outline";

    switch (status.toLowerCase()) {
      case "active":
        return "default";
      case "inactive":
        return "secondary";
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
        <h2 className="text-lg font-semibold">Company Information</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email:</p>
            <p className="text-sm">{email || "No email provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone:</p>
            <p className="text-sm">{phoneNumber || "No phone provided"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Address:
            </p>
            <p className="text-sm">{address || "No address provided"}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Contact Person:
            </p>
            <p className="text-sm">{contactPerson || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Industry:
            </p>
            <p className="text-sm">{industry || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status:</p>
            <div className="mt-1">
              <Badge variant={getStatusVariant(status)}>
                {status || "N/A"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
