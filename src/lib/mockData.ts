import type { Client } from "@/types/client.type";
import type { TeamMember } from "@/types/team-member.type";
import type { Activity } from "@/types/activity.type";
import type { AIInsight } from "@/types/ai-insight.type";
import type { DashboardMetrics } from "@/types/dashboard-metrics.type";

export const mockClients: Client[] = [
  {
    id: "1",
    name: "John Smith",
    company: "Tunza Care",
    email: "john@tunzacare.com",
    phone: "+1 234 567 8900",
    status: "active",
    value: 185000,
    projects: 4,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    company: "NMCYBER",
    email: "sarah@nmcyber.com",
    phone: "+1 234 567 8901",
    status: "active",
    value: 295000,
    projects: 6,
  },
  {
    id: "3",
    name: "Mike Wilson",
    company: "ABC Corporation",
    email: "mike@abccorp.com",
    phone: "+1 234 567 8902",
    status: "active",
    value: 125000,
    projects: 3,
  },
  {
    id: "4",
    name: "Emily Davis",
    company: "XYZ Limited",
    email: "emily@xyzltd.com",
    phone: "+1 234 567 8903",
    status: "pending",
    value: 89000,
    projects: 1,
  },
];

export const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    status: "online",
    activity: "Editing Client Report",
  },
  {
    id: "2",
    name: "Mike Wilson",
    status: "online",
    activity: "In Meeting Room",
  },
  {
    id: "3",
    name: "Emily Davis",
    status: "away",
    activity: "Last seen 5 min ago",
  },
  {
    id: "4",
    name: "Alex Chen",
    status: "online",
    activity: "Reviewing Documents",
  },
];

export const mockActivities: Activity[] = [
  {
    id: "1",
    user: "Sarah Johnson",
    action: "Added comment on Tunza Care proposal",
    time: "2 min ago",
    type: "comment",
  },
  {
    id: "2",
    user: "Mike Wilson",
    action: "Updated project timeline",
    time: "5 min ago",
    type: "update",
  },
  {
    id: "3",
    user: "Emily Davis",
    action: "Started video call with client",
    time: "8 min ago",
    type: "call",
  },
  {
    id: "4",
    user: "Alex Chen",
    action: "Shared financial report",
    time: "12 min ago",
    type: "share",
  },
];

export const mockAIInsights: AIInsight[] = [
  {
    id: "1",
    title: "Revenue Prediction",
    description:
      "Based on current trends, revenue is expected to increase by 23% next quarter.",
    confidence: 94,
    type: "prediction",
    action: "View Forecast",
  },
  {
    id: "2",
    title: "Client Risk Alert",
    description:
      "XYZ Limited shows 67% probability of churn based on engagement patterns.",
    confidence: 78,
    type: "alert",
    action: "Contact Client",
  },
  {
    id: "3",
    title: "Process Optimization",
    description: "Automating invoice processing could save 15 hours/week.",
    confidence: 89,
    type: "optimization",
    action: "Setup Automation",
  },
  {
    id: "4",
    title: "Upsell Opportunity",
    description:
      "Tunza Care is ideal for premium service upgrade (+$45K potential).",
    confidence: 82,
    type: "opportunity",
    action: "View Details",
  },
];

export const mockDashboardMetrics: DashboardMetrics = {
  totalClients: 47,
  activeClients: 23,
  teamMembers: 8,
  activeProjects: 23,
  revenueGrowth: 28.5,
  totalValue: 694000,
  pendingClients: 1,
  clientGrowth: 12,
  teamGrowth: 3,
  projectGrowth: 5,
};
