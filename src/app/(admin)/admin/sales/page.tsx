import { AdminProxy } from "@/lib/proxy";
import { getSalesAnalyticsData } from "@/features/admin/services/sales-analytics-service";
import { MuiSalesAnalytics } from "@/features/admin/components/sales/mui-sales-analytics";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sales Analytics | Nivaroa Admin",
  description: "Monthly and Yearly sales performance analytics",
};

export default async function AdminSalesPage() {
  await AdminProxy();
  const data = await getSalesAnalyticsData();

  return <MuiSalesAnalytics data={data} />;
}

