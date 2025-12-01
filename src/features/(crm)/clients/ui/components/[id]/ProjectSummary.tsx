"use client";

import { Card } from "@/components/ui/card";

interface ProjectSummaryProps {
  activeProjects?: number;
  documents?: number;
}

export function ProjectSummary({
  activeProjects = 4,
  documents = 22,
}: ProjectSummaryProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Project Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{activeProjects}</p>
          <p className="text-xs text-muted-foreground mt-1">Active Projects</p>
        </div>
        <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
          <p className="text-2xl font-bold text-green-600">{documents}</p>
          <p className="text-xs text-muted-foreground mt-1">Documents</p>
        </div>
      </div>
    </Card>
  );
}
