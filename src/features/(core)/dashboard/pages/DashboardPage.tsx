"use client";

import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { Users, Briefcase, TrendingUp } from "lucide-react";
import { MetricCard, InsightCard, LiveCollaboration } from "../components";
import {
  mockDashboardMetrics,
  mockAIInsights,
  mockTeamMembers,
  mockActivities,
} from "../lib/mockData";
import { AppLayout } from "@/shared/components/layout/AppLayout";

export function DashboardPage() {
  const metrics = mockDashboardMetrics;

  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here is what is happening today.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Clients"
            value={metrics.totalClients}
            icon={Users}
            iconColor="bg-blue-500"
            growth={metrics.clientGrowth}
          />
          <MetricCard
            title="Team Members"
            value={metrics.teamMembers}
            icon={Users}
            iconColor="bg-green-500"
            growth={metrics.teamGrowth}
          />
          <MetricCard
            title="Active Projects"
            value={metrics.activeProjects}
            icon={Briefcase}
            iconColor="bg-purple-500"
            growth={metrics.projectGrowth}
          />
          <MetricCard
            title="Revenue Growth"
            value={`${metrics.revenueGrowth}%`}
            icon={TrendingUp}
            iconColor="bg-orange-500"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">AI-Powered Insights</h2>
                <Badge>BETA</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {mockAIInsights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            </Card>
          </div>

          <div>
            <LiveCollaboration
              teamMembers={mockTeamMembers}
              activities={mockActivities}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
