export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "active" | "pending" | "inactive";
  value: number;
  projects: number;
  avatar?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  status: "online" | "offline" | "away";
  activity: string;
  avatar?: string;
  lastSeen?: string;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  type: "comment" | "update" | "call" | "share";
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  type: "prediction" | "alert" | "optimization" | "opportunity";
  action?: string;
}

export interface DashboardMetrics {
  totalClients: number;
  activeClients: number;
  teamMembers: number;
  activeProjects: number;
  revenueGrowth: number;
  totalValue: number;
  pendingClients: number;
  clientGrowth: number;
  teamGrowth: number;
  projectGrowth: number;
}
