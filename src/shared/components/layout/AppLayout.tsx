"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { cn } from "@/shared/utils/cn";
import { useSidebar } from "@/shared/contexts";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const {
    isCollapsed,
    isMobileOpen,
    toggleCollapse,
    toggleMobile,
    closeMobile,
  } = useSidebar();

  return (
    <div className="min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="lg:hidden">
          <Sidebar />
        </div>
      )}

      <div
        className={cn(
          "transition-all duration-300",
          isCollapsed ? "lg:pl-16" : "lg:pl-56"
        )}
      >
        <Header />
        <main className="px-4 py-2 sm:px-6 sm:py-2">{children}</main>
      </div>
    </div>
  );
}
