export interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  type: "prediction" | "alert" | "optimization" | "opportunity";
  action?: string;
}
