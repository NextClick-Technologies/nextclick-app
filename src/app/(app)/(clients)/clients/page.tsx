"use client";

import { AppLayout } from "@/shared/components/layout/AppLayout";
import { ClientsPage } from "@/features/(crm)/clients";

export default function Page() {
  return (
    <AppLayout>
      <ClientsPage />
    </AppLayout>
  );
}
