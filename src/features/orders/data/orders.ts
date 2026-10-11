import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import type { OrderRecord } from "../schemas/order.schema";

export async function getUserOrders(userId: string): Promise<OrderRecord[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data as OrderRecord[];
  } catch {
    return [];
  }
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<OrderRecord | null> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    let { data } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (!data) {
      // Try by UUID id if orderNumber is an id
      const res = await supabase
        .from("orders")
        .select(`
          *,
          items:order_items(*)
        `)
        .eq("id", orderNumber)
        .maybeSingle();
      data = res.data;
    }

    if (!data) return null;

    return data as OrderRecord;
  } catch {
    return null;
  }
}

export async function getAllOrders(): Promise<OrderRecord[]> {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data as OrderRecord[];
  } catch {
    return [];
  }
}

