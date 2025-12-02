"use client";

import { Card } from "@/shared/components/ui/card";
import { sanitizeHtml } from "@/shared/utils/sanitize";

interface AddressInformationProps {
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
}

export function AddressInformation({
  address,
  city,
  state,
  zipCode,
  country,
}: AddressInformationProps) {
  const hasAddress = address || city || state || zipCode || country;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
          <span className="text-xs">📍</span>
        </div>
        <h2 className="text-lg font-semibold">Address Information</h2>
      </div>
      {hasAddress ? (
        <div className="space-y-2">
          {address && (
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(address) }}
            />
          )}
          <p className="text-sm">
            {[city, state, zipCode].filter(Boolean).join(", ")}
          </p>
          {country && <p className="text-sm">{country}</p>}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No address information available
        </p>
      )}
    </Card>
  );
}
