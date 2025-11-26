"use client";

import { Card } from "@/components/ui/card";

interface ContactInformationProps {
  email: string | null;
  phoneNumber: string;
  contactPerson: string;
}

export function ContactInformation({
  email,
  phoneNumber,
  contactPerson,
}: ContactInformationProps) {
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
      </div>
    </Card>
  );
}
