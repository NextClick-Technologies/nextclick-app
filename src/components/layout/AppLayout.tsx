"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./Header";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/utils/cn";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <VisuallyHidden>
            <SheetTitle>Navigation Menu</SheetTitle>
          </VisuallyHidden>
          <Sidebar />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "lg:pl-16" : "lg:pl-64"
        )}
      >
        <Header onMenuClick={() => setIsMobileOpen(true)} />
        <main className="px-4 py-4 sm:px-6 sm:py-6">{children}</main>
      </div>
    </div>
  );
}
