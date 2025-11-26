"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClientStatus } from "@/types";

interface ContactInformationProps {
  email: string | null;
  phoneNumber: string;
  contactPerson: string;
  status: ClientStatus;
  joinDate: string | null;
  companyName: string;
}

export function ContactInformation({
  email,
  phoneNumber,
  contactPerson,
  status,
  joinDate,
  companyName,
}: ContactInformationProps) {
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
          <span className="text-xs">✉</span>
        </div>
        <h2 className="text-lg font-semibold">Contact Information</h2>
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
            <p className="text-sm">{phoneNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Contact Person:
            </p>
            <p className="text-sm">{contactPerson}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status:</p>
            <div className="mt-1">
              <Badge variant={getStatusVariant(status)}>{status}</Badge>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Join Date:
            </p>
            <p className="text-sm">
              {joinDate ? new Date(joinDate).toLocaleDateString() : "N/A"}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Company:
            </p>
            <p className="text-sm">{companyName}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
