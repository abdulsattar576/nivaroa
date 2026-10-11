import { AdminProxy } from "@/lib/proxy";
import { getAdminUsersData } from "@/features/admin/services/users-service";
import { MuiAdminUsers } from "@/features/admin/components/users/mui-admin-users";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Customers & Users | Nivaroa Admin",
  description: "Manage registered customer profiles, orders, and roles",
};

export default async function AdminUsersPage() {
  await AdminProxy();
  const data = await getAdminUsersData();

  return <MuiAdminUsers data={data} />;
}

