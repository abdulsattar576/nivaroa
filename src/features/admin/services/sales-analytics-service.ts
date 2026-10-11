import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export interface MonthlyBreakdown {
  monthKey: string; // e.g. "2026-10"
  monthLabel: string; // e.g. "Oct 2026"
  year: number;
  month: number; // 1-12
  totalSales: number;
  orderCount: number;
  deliveredOrders: number;
  cancelledOrders: number;
  avgOrderValue: number;
}

export interface YearlyBreakdown {
  year: number;
  totalSales: number;
  orderCount: number;
  deliveredOrders: number;
  cancelledOrders: number;
  avgOrderValue: number;
  monthlyBreakdown: MonthlyBreakdown[];
}

export interface SalesAnalyticsData {
  summary: {
    lifetimeRevenue: number;
    lifetimeOrders: number;
    currentYearSales: number;
    currentMonthSales: number;
    previousMonthSales: number;
    monthOverMonthGrowth: number; // percentage
  };
  yearsAvailable: number[];
  yearlyBreakdowns: YearlyBreakdown[];
  // All months in chronologically descending order
  allMonths: MonthlyBreakdown[];
}

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export async function getSalesAnalyticsData(): Promise<SalesAnalyticsData> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: rawOrders, error } = await supabase
    .from("orders")
    .select("id, order_number, total, status, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Sales analytics orders fetch error:", error);
  }

  const orders = rawOrders || [];

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthNum = now.getMonth() + 1; // 1-12

  // Map keyed by "YYYY-MM"
  const monthMap = new Map<string, {
    year: number;
    month: number;
    totalSales: number;
    orderCount: number;
    deliveredOrders: number;
    cancelledOrders: number;
  }>();

  let lifetimeRevenue = 0;
  let lifetimeOrders = orders.length;

  for (const o of orders) {
    const amount = Number(o.total) || 0;
    const isCancelled = o.status === "cancelled";

    if (!isCancelled) {
      lifetimeRevenue += amount;
    }

    const d = new Date(o.created_at);
    if (isNaN(d.getTime())) continue;

    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const key = `${y}-${String(m).padStart(2, "0")}`;

    const existing = monthMap.get(key) || {
      year: y,
      month: m,
      totalSales: 0,
      orderCount: 0,
      deliveredOrders: 0,
      cancelledOrders: 0,
    };

    existing.orderCount += 1;
    if (isCancelled) {
      existing.cancelledOrders += 1;
    } else {
      existing.totalSales += amount;
      if (o.status === "delivered") {
        existing.deliveredOrders += 1;
      }
    }

    monthMap.set(key, existing);
  }

  // Format all months
  const allMonths: MonthlyBreakdown[] = Array.from(monthMap.entries()).map(([monthKey, val]) => {
    return {
      monthKey,
      monthLabel: `${MONTH_NAMES[val.month - 1]} ${val.year}`,
      year: val.year,
      month: val.month,
      totalSales: val.totalSales,
      orderCount: val.orderCount,
      deliveredOrders: val.deliveredOrders,
      cancelledOrders: val.cancelledOrders,
      avgOrderValue: val.orderCount > 0 ? val.totalSales / val.orderCount : 0,
    };
  });

  // Collect unique years: ensure at least a 3-year timeline window (e.g. 2024, 2025, 2026)
  // so Year-over-Year comparison plots a real multi-point coordinate graph instead of a single giant block.
  const yearSet = new Set<number>();
  allMonths.forEach(m => yearSet.add(m.year));
  yearSet.add(currentYear);
  yearSet.add(currentYear - 1);
  yearSet.add(currentYear - 2);

  const yearsAvailable = Array.from(yearSet).sort((a, b) => b - a);

  // Group by year: provide all 12 calendar months of that year so line/area/bar graphs
  // can plot the real trajectory across the year with hollow points and zero-level baselines,
  // preventing a single month from expanding into a giant filled rectangle.
  const yearlyBreakdowns: YearlyBreakdown[] = yearsAvailable.map(year => {
    const monthsForYear: MonthlyBreakdown[] = Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const key = `${year}-${String(monthNum).padStart(2, "0")}`;
      const rec = monthMap.get(key);

      return {
        monthKey: key,
        monthLabel: `${MONTH_NAMES[i]} ${year}`,
        year,
        month: monthNum,
        totalSales: rec ? rec.totalSales : 0,
        orderCount: rec ? rec.orderCount : 0,
        deliveredOrders: rec ? rec.deliveredOrders : 0,
        cancelledOrders: rec ? rec.cancelledOrders : 0,
        avgOrderValue: rec && rec.orderCount > 0 ? rec.totalSales / rec.orderCount : 0,
      };
    });

    const recordedMonthsOnly = monthsForYear.filter(m => m.orderCount > 0);
    const yearTotalSales = recordedMonthsOnly.reduce((sum, m) => sum + m.totalSales, 0);
    const yearOrderCount = recordedMonthsOnly.reduce((sum, m) => sum + m.orderCount, 0);
    const yearDelivered = recordedMonthsOnly.reduce((sum, m) => sum + m.deliveredOrders, 0);
    const yearCancelled = recordedMonthsOnly.reduce((sum, m) => sum + m.cancelledOrders, 0);

    return {
      year,
      totalSales: yearTotalSales,
      orderCount: yearOrderCount,
      deliveredOrders: yearDelivered,
      cancelledOrders: yearCancelled,
      avgOrderValue: yearOrderCount > 0 ? yearTotalSales / yearOrderCount : 0,
      monthlyBreakdown: monthsForYear,
    };
  });

  // Current year & month sales
  const currentYearObj = yearlyBreakdowns.find(y => y.year === currentYear);
  const currentYearSales = currentYearObj ? currentYearObj.totalSales : 0;

  const currentMonthKey = `${currentYear}-${String(currentMonthNum).padStart(2, "0")}`;
  const currentMonthSales = monthMap.get(currentMonthKey)?.totalSales || 0;

  // Previous month calculation
  const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthKey = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, "0")}`;
  const previousMonthSales = monthMap.get(prevMonthKey)?.totalSales || 0;

  const monthOverMonthGrowth = previousMonthSales > 0
    ? ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100
    : currentMonthSales > 0 ? 100 : 0;

  return {
    summary: {
      lifetimeRevenue,
      lifetimeOrders,
      currentYearSales,
      currentMonthSales,
      previousMonthSales,
      monthOverMonthGrowth,
    },
    yearsAvailable,
    yearlyBreakdowns,
    allMonths: allMonths.sort((a, b) => b.monthKey.localeCompare(a.monthKey)),
  };
}

