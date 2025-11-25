import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  growth?: number;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  iconColor,
  growth,
}: MetricCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {growth !== undefined && (
            <p className="text-sm text-muted-foreground">
              <span
                className={cn(
                  "font-medium",
                  growth >= 0 ? "text-green-600" : "text-red-600"
                )}
              >
                {growth >= 0 ? "+" : ""}
                {growth}%
              </span>
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            iconColor
          )}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </Card>
  );
}
