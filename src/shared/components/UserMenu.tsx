"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Avatar } from "@/shared/components/ui/avatar";
import { useAuth } from "@/shared/contexts";

interface UserMenuProps {
  isCollapsed?: boolean;
}

export function UserMenu({ isCollapsed = false }: UserMenuProps) {
  const { user, signOut } = useAuth();

  // Get display name from email (first part before @)
  const displayName = user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="border-t p-3">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex-1 justify-start",
                isCollapsed ? "h-10 w-10 p-0" : "h-12"
              )}
            >
              <Avatar className="h-8 w-8 bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-medium">{initial}</span>
              </Avatar>
              {!isCollapsed && (
                <div className="ml-3 flex flex-col items-start overflow-hidden">
                  <p className="text-sm font-medium leading-none truncate w-full">
                    {displayName}
                  </p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {displayName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {!isCollapsed && <ThemeToggle />}
      </div>
    </div>
  );
}
