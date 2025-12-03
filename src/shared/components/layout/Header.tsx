"use client";

import { Input } from "@/shared/components/ui/input";
import { Bell, MessageSquare, Search, Menu } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { useSidebar } from "@/shared/contexts";

export function Header() {
  const { toggleMobile } = useSidebar();
  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleMobile}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="flex flex-1 items-center gap-4 justify-end">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Find..." className="pl-10" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
            <span className="sr-only">Messages</span>
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">
              1
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
