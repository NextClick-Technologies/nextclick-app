"use client";

import { SidebarProvider, AuthProvider, AppProvider } from "@/contexts";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        <SidebarProvider>{children}</SidebarProvider>
      </AppProvider>
    </AuthProvider>
  );
}
