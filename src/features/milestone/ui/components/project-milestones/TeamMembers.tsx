"use client";

import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Button } from "@/shared/components/ui/button";
import { Users } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  familyName: string;
  role?: string | null;
}

interface TeamMembersProps {
  members?: TeamMember[];
  onManageTeam?: () => void;
}

export function TeamMembers({ members = [], onManageTeam }: TeamMembersProps) {
  const getInitials = (name: string, familyName: string) => {
    return `${name.charAt(0)}${familyName.charAt(0)}`.toUpperCase();
  };

  const getFullName = (name: string, familyName: string) => {
    return `${name} ${familyName}`;
  };

  if (members.length === 0 && !onManageTeam) {
    return (
      <div className="text-sm text-muted-foreground">
        No team members assigned
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {members.length > 0 ? (
        <TooltipProvider>
          <div className="flex -space-x-2">
            {members.map((member) => (
              <Tooltip key={member.id}>
                <TooltipTrigger asChild>
                  <Avatar className="border-2 border-background cursor-pointer hover:z-10">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(member.name, member.familyName)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <div className="font-medium">
                      {getFullName(member.name, member.familyName)}
                    </div>
                    {member.role && (
                      <div className="text-xs text-muted-foreground">
                        {member.role}
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      ) : (
        <div className="text-sm text-muted-foreground">
          No team members assigned
        </div>
      )}

      {onManageTeam && (
        <Button variant="outline" size="sm" onClick={onManageTeam}>
          <Users className="h-4 w-4 mr-2" />
          Members
        </Button>
      )}
    </div>
  );
}
