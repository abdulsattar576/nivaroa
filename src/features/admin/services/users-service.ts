import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

export interface AdminUserListItem {
  id: string;
  fullName: string;
  role: "user" | "admin";
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null;
  email?: string;
  phone?: string;
}

export interface AdminUsersData {
  users: AdminUserListItem[];
  metrics: {
    totalUsers: number;
    adminCount: number;
    customerCount: number;
    activeBuyersCount: number;
  };
}

export async function getAdminUsersData(): Promise<AdminUsersData> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // 1. Fetch all profiles
  const { data: profilesData, error: profilesError } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (profilesError) {
    console.error("Admin users profiles fetch error:", profilesError);
  }

  const profiles = profilesData || [];

  // 2. Fetch all orders with user_id to compute total spent, orders count, and last order
  const { data: ordersData, error: ordersError } = await supabase
    .from("orders")
    .select("id, user_id, customer_name, customer_email, customer_phone, total, status, created_at");

  if (ordersError) {
    console.error("Admin users orders fetch error:", ordersError);
  }

  const orders = ordersData || [];

  // Map user orders aggregation by user_id and by customer_email (for fallback)
  const userOrdersMap = new Map<string, {
    count: number;
    totalSpent: number;
    lastOrderDate: string | null;
    email?: string;
    phone?: string;
    customerName?: string;
  }>();

  const emailOrdersMap = new Map<string, {
    count: number;
    totalSpent: number;
    lastOrderDate: string | null;
    phone?: string;
    customerName?: string;
  }>();

  for (const o of orders) {
    const isCancelled = o.status === "cancelled";
    const amount = Number(o.total || 0);

    // Group by user_id if present
    if (o.user_id) {
      const existing = userOrdersMap.get(o.user_id) || {
        count: 0,
        totalSpent: 0,
        lastOrderDate: null,
        email: o.customer_email || undefined,
        phone: o.customer_phone || undefined,
        customerName: o.customer_name || undefined,
      };

      existing.count += 1;
      if (!isCancelled) {
        existing.totalSpent += amount;
      }
      if (o.customer_email) existing.email = o.customer_email;
      if (o.customer_phone) existing.phone = o.customer_phone;
      if (o.customer_name) existing.customerName = o.customer_name;

      if (!existing.lastOrderDate || new Date(o.created_at) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = o.created_at;
      }
      userOrdersMap.set(o.user_id, existing);
    }

    // Also group by email
    if (o.customer_email) {
      const emailKey = o.customer_email.toLowerCase().trim();
      const existingEmail = emailOrdersMap.get(emailKey) || {
        count: 0,
        totalSpent: 0,
        lastOrderDate: null,
        phone: o.customer_phone || undefined,
        customerName: o.customer_name || undefined,
      };

      existingEmail.count += 1;
      if (!isCancelled) {
        existingEmail.totalSpent += amount;
      }
      if (o.customer_phone) existingEmail.phone = o.customer_phone;
      if (o.customer_name) existingEmail.customerName = o.customer_name;

      if (!existingEmail.lastOrderDate || new Date(o.created_at) > new Date(existingEmail.lastOrderDate)) {
        existingEmail.lastOrderDate = o.created_at;
      }
      emailOrdersMap.set(emailKey, existingEmail);
    }
  }

  let adminCount = 0;
  let customerCount = 0;
  let activeBuyersCount = 0;

  const users: AdminUserListItem[] = profiles.map((p) => {
    // Check by user_id first
    let stats = userOrdersMap.get(p.id);

    // If profile has no user_id match on orders, check if orders match customer_name
    if (!stats && p.full_name) {
      for (const [, em] of emailOrdersMap) {
        if (em.customerName?.toLowerCase() === p.full_name.toLowerCase()) {
          stats = em;
          break;
        }
      }
    }

    const orderCount = stats?.count || 0;
    const totalSpent = stats?.totalSpent || 0;
    const lastOrderDate = stats?.lastOrderDate || null;
    const email = stats?.email;
    const phone = stats?.phone;

    if (p.role === "admin") {
      adminCount += 1;
    } else {
      customerCount += 1;
    }

    if (orderCount > 0) {
      activeBuyersCount += 1;
    }

    return {
      id: p.id,
      fullName: p.full_name || "Valued Customer",
      role: p.role,
      createdAt: p.created_at,
      totalOrders: orderCount,
      totalSpent,
      lastOrderDate,
      email,
      phone,
    };
  });

  // If there are guest orders whose email does not match any profile, also list them as registered/guest customers
  const coveredEmails = new Set(users.map(u => u.email?.toLowerCase()).filter(Boolean));
  for (const [email, stats] of emailOrdersMap) {
    if (!coveredEmails.has(email) && stats.customerName) {
      customerCount += 1;
      activeBuyersCount += 1;
      users.push({
        id: `guest-${email}`,
        fullName: stats.customerName,
        role: "user",
        createdAt: stats.lastOrderDate || new Date().toISOString(),
        totalOrders: stats.count,
        totalSpent: stats.totalSpent,
        lastOrderDate: stats.lastOrderDate,
        email,
        phone: stats.phone,
      });
    }
  }

  return {
    users,
    metrics: {
      totalUsers: users.length,
      adminCount,
      customerCount,
      activeBuyersCount,
    },
  };
}

