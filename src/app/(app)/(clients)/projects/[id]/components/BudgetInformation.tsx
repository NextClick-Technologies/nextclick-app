"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PaymentTerms } from "@/types";

interface BudgetInformationProps {
  budget: string | null;
  paymentTerms: PaymentTerms | null;
}

export function BudgetInformation({
  budget,
  paymentTerms,
}: BudgetInformationProps) {
  const formatPaymentTerms = (terms: PaymentTerms | null) => {
    if (!terms) return "N/A";
    return terms.replace("_", " ").toUpperCase();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 rounded bg-primary/10 flex items-center justify-center">
          <span className="text-xs">💰</span>
        </div>
        <h2 className="text-lg font-semibold">Budget Information</h2>
      </div>
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Total Budget
          </p>
          <p className="text-3xl font-bold">
            ${Number(budget || 0).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Payment Terms
          </p>
          <Badge variant="outline">{formatPaymentTerms(paymentTerms)}</Badge>
        </div>
      </div>
    </Card>
  );
}
