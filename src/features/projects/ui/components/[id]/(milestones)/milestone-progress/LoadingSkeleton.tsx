"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Milestone Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="h-8 w-full animate-pulse rounded bg-muted" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
