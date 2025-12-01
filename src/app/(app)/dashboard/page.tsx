import { AppLayout } from "@/shared/components/layout/AppLayout";
import { DashboardPage } from "@/features/(core)/dashboard";

export default function Page() {
  return (
    <AppLayout>
      <DashboardPage />
    </AppLayout>
  );
}
