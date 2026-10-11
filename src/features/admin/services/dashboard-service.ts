import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export type AdminDashboardData = {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    pendingOrdersCount: number;
    totalProducts: number;
    totalInventoryUnits: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalCategories: number;
    totalCustomers: number;
  };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    totalAmount: number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    createdAt: string;
  }>;
  productsSummary: Array<{
    id: string;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    isFeatured: boolean;
    image: string | null;
    categoryName: string;
  }>;
  salesSummary: Array<{
    productId: string;
    productName: string;
    unitsSold: number;
    revenue: number;
  }>;
  statusBreakdown: {
    pending: number;
    confirmed: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  // New fields for month/year sales and trend
  monthlySales: number;
  yearlySales: number;
  salesTrend: Array<{ period: string; label: string; amount: number; orderCount: number }>;
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Fetch Orders (using 'total' which is the database column)
  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select(
      "id, order_number, user_id, customer_name, customer_email, customer_phone, total, payment_method, payment_status, status, created_at"
    )
    .order("created_at", { ascending: false });

  if (ordersError) {
    console.error("Admin dashboard orders fetch error:", ordersError);
  }

  const orders = ordersData || [];

  // 2. Fetch Products with Category
  const { data: productsData, error: productsError } = await supabase
    .from("products")
    .select(
      "id, name, slug, price, quantity, is_featured, image_path, images, created_at, category:categories(name)"
    )
    .order("created_at", { ascending: false });

  if (productsError) {
    console.error("Admin dashboard products fetch error:", productsError);
  }

  const products = productsData || [];

  // 3. Fetch Categories count
  const { count: categoriesCount } = await supabase
    .from("categories")
    .select("id", { count: "exact", head: true });

  // 4. Fetch Customers count (profiles with role 'user' and distinct ordering customers)
  const { data: userProfiles } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "user");

  const customerIdSet = new Set<string>((userProfiles || []).map(p => p.id));
  for (const o of orders) {
    if (o.user_id) {
      customerIdSet.add(o.user_id);
    } else if (o.customer_email) {
      customerIdSet.add(o.customer_email.toLowerCase().trim());
    }
  }
  const customersCount = Math.max(customerIdSet.size, (userProfiles || []).length);

  // 5. Fetch Order Items to calculate real product sales
  const { data: orderItemsData } = await supabase
    .from("order_items")
    .select("product_id, product_name, quantity, total");

  const orderItems = orderItemsData || [];

  // Compute Order Metrics
  let totalRevenue = 0;
  const statusBreakdown = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  for (const order of orders) {
    const amount = Number(order.total) || 0;
    if (order.status !== "cancelled") {
      totalRevenue += amount;
    }

    const s = (order.status || "pending").toLowerCase();
    if (s in statusBreakdown) {
      statusBreakdown[s as keyof typeof statusBreakdown] += 1;
    }
  }

  const totalOrders = orders.length;
  const averageOrderValue =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Monthly and yearly sales aggregations
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOf12Months = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const monthOrders = orders.filter(o => new Date(o.created_at) >= startOfMonth);
  const yearOrders = orders.filter(o => new Date(o.created_at) >= startOfYear);
  const monthlySales = monthOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const yearlySales = yearOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);

  const MONTH_NAMES = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const trendMap = new Map<string, { label: string; amount: number; orderCount: number }>();
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    const d = new Date(o.created_at);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const key = `${year}-${String(month).padStart(2, "0")}`;
      const label = `${MONTH_NAMES[month - 1]} ${year}`;
      const current = trendMap.get(key) || { label, amount: 0, orderCount: 0 };
      current.amount += Number(o.total || 0);
      current.orderCount += 1;
      trendMap.set(key, current);
    }
  }

  const salesTrend = Array.from(trendMap.entries())
    .map(([period, data]) => ({
      period,
      label: data.label,
      amount: data.amount,
      orderCount: data.orderCount,
    }))
    .sort((a, b) => a.period.localeCompare(b.period));

  // Compute Product & Inventory Metrics
  let totalInventoryUnits = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (const p of products) {
    const qty = Number(p.quantity) || 0;
    totalInventoryUnits += qty;
    if (qty === 0) {
      outOfStockCount += 1;
    } else if (qty < 5) {
      lowStockCount += 1;
    }
  }

  // Format Recent Orders (latest 10)
  const recentOrders = orders.slice(0, 10).map((order) => ({
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.customer_name || "Valued Customer",
    customerEmail: order.customer_email || "",
    customerPhone: order.customer_phone || "",
    totalAmount: Number(order.total) || 0,
    paymentMethod: order.payment_method || "COD",
    paymentStatus: order.payment_status || "unpaid",
    status: order.status || "pending",
    createdAt: order.created_at,
  }));

  // Format Products Summary (latest 6)
  const productsSummary = products.slice(0, 6).map((p: any) => {
    const img =
      (Array.isArray(p.images) && p.images[0]) ||
      p.image_path ||
      null;

    return {
      id: p.id,
      name: p.name,
      slug: p.slug || p.id,
      price: Number(p.price) || 0,
      quantity: Number(p.quantity) || 0,
      isFeatured: Boolean(p.is_featured),
      image: img,
      categoryName: p.category?.name || "Uncategorized",
    };
  });

  // Calculate Real Sales per product from order_items
  const salesMap = new Map<
    string,
    { productId: string; productName: string; unitsSold: number; revenue: number }
  >();

  for (const item of orderItems) {
    const key = item.product_id || item.product_name;
    const existing = salesMap.get(key) || {
      productId: item.product_id,
      productName: item.product_name,
      unitsSold: 0,
      revenue: 0,
    };
    existing.unitsSold += Number(item.quantity) || 0;
    existing.revenue += Number(item.total) || 0;
    salesMap.set(key, existing);
  }

  const salesSummary = Array.from(salesMap.values())
    .sort((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);

  return {
    metrics: {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      pendingOrdersCount: statusBreakdown.pending + statusBreakdown.confirmed,
      totalProducts: products.length,
      totalInventoryUnits,
      lowStockCount,
      outOfStockCount,
      totalCategories: categoriesCount || 0,
      totalCustomers: customersCount || 0,
    },
    recentOrders,
    productsSummary,
    salesSummary,
    statusBreakdown,
    monthlySales,
    yearlySales,
    salesTrend,
  };
}
