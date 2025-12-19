"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { SidebarProvider, SidebarInset } from "@/shared/components/ui/sidebar";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 space-y-4 p-4 pt-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
