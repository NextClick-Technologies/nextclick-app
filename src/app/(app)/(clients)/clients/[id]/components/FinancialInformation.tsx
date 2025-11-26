"use client";

import { Card } from "@/components/ui/card";

interface FinancialInformationProps {
  totalContractValue: number | null;
}

export function FinancialInformation({
  totalContractValue,
}: FinancialInformationProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
          <span className="text-xs">$</span>
        </div>
        <h2 className="text-lg font-semibold">Financial Information</h2>
      </div>
      <div>
        <p className="text-3xl font-bold text-green-600">
          ${(totalContractValue ?? 0).toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Total Contract Value
        </p>
      </div>
    </Card>
  );
}
