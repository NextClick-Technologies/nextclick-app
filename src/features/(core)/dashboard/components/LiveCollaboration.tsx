import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Avatar } from "@/shared/components/ui/avatar";
import type { TeamMember, Activity } from "../types";
import { Circle } from "lucide-react";

interface LiveCollaborationProps {
  teamMembers: TeamMember[];
  activities: Activity[];
}

export function LiveCollaboration({
  teamMembers,
  activities,
}: LiveCollaborationProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Live Collaboration</h3>
            <Badge variant="secondary" className="text-xs">
              {teamMembers.filter((m) => m.status === "online").length} online
            </Badge>
          </div>
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">
              Active Team Members
            </h4>
            {teamMembers.map((member) => (
              <TeamMemberItem key={member.id} member={member} />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">
            Recent Activity
          </h4>
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function TeamMemberItem({ member }: { member: TeamMember }) {
  const statusColors = {
    online: "text-green-500",
    offline: "text-gray-400",
    away: "text-yellow-500",
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Avatar className="h-9 w-9 bg-primary/10 flex items-center justify-center">
          <span className="text-xs font-medium">
            {member.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
        </Avatar>
        <Circle
          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-current ${
            statusColors[member.status]
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{member.name}</p>
        <p className="text-xs text-muted-foreground truncate">
          {member.activity}
        </p>
      </div>
      <Badge variant="outline" className="text-xs">
        {member.status}
      </Badge>
    </div>
  );
}

function ActivityItem({ activity }: { activity: Activity }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
        <span className="text-xs font-medium">
          {activity.user
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{activity.user}</span>{" "}
          <span className="text-muted-foreground">{activity.action}</span>
        </p>
        <p className="text-xs text-muted-foreground">{activity.time}</p>
      </div>
    </div>
  );
}
