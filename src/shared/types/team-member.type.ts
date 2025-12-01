export interface TeamMember {
  id: string;
  name: string;
  status: "online" | "offline" | "away";
  activity: string;
  avatar?: string;
  lastSeen?: string;
}
