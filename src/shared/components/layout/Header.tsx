"use client";

import { Input } from "@/shared/components/ui/input";
import { Bell, MessageSquare, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Separator } from "@/shared/components/ui/separator";

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 shadow-sm">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

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
    </header>
  );
}
