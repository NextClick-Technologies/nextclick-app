"use client";

import { AuthProvider, AppProvider } from "@/shared/contexts";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>{children}</AppProvider>
    </AuthProvider>
  );
}
