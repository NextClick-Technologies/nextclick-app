import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AIInsight } from "@/types";
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  Target,
  LucideIcon,
} from "lucide-react";

interface InsightCardProps {
  insight: AIInsight;
}

const iconMap: Record<AIInsight["type"], LucideIcon> = {
  prediction: TrendingUp,
  alert: AlertTriangle,
  optimization: Zap,
  opportunity: Target,
};

const colorMap: Record<AIInsight["type"], string> = {
  prediction: "bg-blue-500/10 text-blue-600",
  alert: "bg-red-500/10 text-red-600",
  optimization: "bg-purple-500/10 text-purple-600",
  opportunity: "bg-amber-500/10 text-amber-600",
};

export function InsightCard({ insight }: InsightCardProps) {
  const Icon = iconMap[insight.type];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-lg ${
              colorMap[insight.type]
            }`}
          >
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {insight.confidence}% confidence
          </Badge>
        </div>
        <div>
          <h3 className="font-semibold mb-2">{insight.title}</h3>
          <p className="text-sm text-muted-foreground">{insight.description}</p>
        </div>
        {insight.action && (
          <Button variant="outline" size="sm" className="w-full">
            {insight.action}
          </Button>
        )}
      </div>
    </Card>
  );
}
