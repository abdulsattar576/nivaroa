import { AdminProxy } from "@/lib/proxy";
import { getAdminDashboardData } from "@/features/admin/services/dashboard-service";
import { MuiAdminDashboard } from "@/features/admin/components/dashboard/mui-admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await AdminProxy();
  const data = await getAdminDashboardData();

  return (
    <MuiAdminDashboard
      data={data}
      adminName={session.profile.full_name || "Admin"}
    />
  );
}