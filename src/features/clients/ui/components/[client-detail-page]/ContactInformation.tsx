"use client";

import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { ClientStatus } from "@/features/clients/domain/types";
import Link from "next/link";

interface ContactInformationProps {
  email: string | null;
  phoneNumber: string;
  contactPerson: string;
  status: ClientStatus;
  joinDate: string | null;
  companyName: string;
  companyId: string | null;
}

export function ContactInformation({
  email,
  phoneNumber,
  contactPerson,
  status,
  joinDate,
  companyName,
  companyId,
}: ContactInformationProps) {
  const getStatusColor = (status: ClientStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "inactive":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      case "pending":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
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
          <Badge className={getStatusColor(status)}>{status}</Badge>
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
          <p className="text-sm font-medium text-muted-foreground">Company:</p>
          {companyId ? (
            <Link
              href={`/companies/${companyId}`}
              className="text-sm text-primary hover:underline"
            >
              {companyName}
            </Link>
          ) : (
            <p className="text-sm">{companyName}</p>
          )}
        </div>
      </div>
    </Card>
  );
}
