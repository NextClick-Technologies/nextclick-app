"use client";

import { Card } from "@/shared/components/ui/card";

interface ContactInformationProps {
  email: string;
  phoneNumber: string;
  emergencyContact: string | null;
  emergencyPhone: string | null;
}

export function ContactInformation({
  email,
  phoneNumber,
  emergencyContact,
  emergencyPhone,
}: ContactInformationProps) {
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
            <p className="text-sm">{email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Phone:</p>
            <p className="text-sm">{phoneNumber}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Emergency Contact:
            </p>
            <p className="text-sm">{emergencyContact || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Emergency Phone:
            </p>
            <p className="text-sm">{emergencyPhone || "N/A"}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
