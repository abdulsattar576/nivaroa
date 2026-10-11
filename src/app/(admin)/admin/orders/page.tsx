import { cookies } from "next/headers";
import { AdminProxy } from "@/lib/proxy";
import { createClient } from "@/utils/supabase/server";
import {
  MuiAdminOrders,
  type AdminOrder,
} from "@/features/admin/components/orders/mui-admin-orders";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await AdminProxy();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: rawOrders, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      city,
      postal_code,
      notes,
      payment_method,
      payment_status,
      status,
      subtotal,
      shipping_fee,
      total,
      created_at,
      items:order_items(
        id,
        product_id,
        product_name,
        price,
        quantity,
        total,
        product_image
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Admin orders page query error:", error);
  }

  const orders: AdminOrder[] = (rawOrders || []).map((o: any) => ({
    id: o.id,
    orderNumber: o.order_number,
    customerName: o.customer_name || "Valued Customer",
    customerEmail: o.customer_email || "",
    customerPhone: o.customer_phone || "",
    shippingAddress: o.shipping_address || "",
    city: o.city || "",
    postalCode: o.postal_code || null,
    orderNotes: o.notes || null,
    paymentMethod: o.payment_method || "COD",
    paymentStatus: o.payment_status || "unpaid",
    status: o.status || "pending",
    subtotal: Number(o.subtotal) || 0,
    shippingFee: Number(o.shipping_fee) || 0,
    totalAmount: Number(o.total) || 0,
    createdAt: o.created_at,
    items: Array.isArray(o.items)
      ? o.items.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          productName: item.product_name,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          total: Number(item.total) || 0,
          imageUrl: item.product_image || null,
        }))
      : [],
  }));

  return <MuiAdminOrders orders={orders} />;
}
