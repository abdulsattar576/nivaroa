"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import {
  CheckoutSchema,
  type CheckoutFormData,
  type OrderStatus,
} from "../schemas/order.schema";

export type CheckoutCartItemInput = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
};

/**
 * Creates a Cash on Delivery or online order and its line items in Supabase
 */
export async function createOrder(
  formData: CheckoutFormData,
  items: CheckoutCartItemInput[]
) {
  const validation = CheckoutSchema.safeParse(formData);
  if (!validation.success) {
    return {
      success: false as const,
      message:
        validation.error.issues[0]?.message ||
        "Please check your shipping and contact information.",
    };
  }

  if (!items || items.length === 0) {
    return {
      success: false as const,
      message: "Your shopping bag is empty. Please add items before checking out.",
    };
  }

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Optional authenticated user attachment
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const shippingFee = subtotal >= 100 ? 0 : 10;
  const total = subtotal + shippingFee;

  // Generate unique order reference and ID
  const orderId = crypto.randomUUID();
  const timestamp = Date.now().toString().slice(-6);
  const randomSuffix = Math.floor(10 + Math.random() * 90);
  const orderNumber = `NVR-${timestamp}${randomSuffix}`;

  // 1. Insert Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      id: orderId,
      order_number: orderNumber,
      user_id: user?.id || null,
      status: "pending",
      payment_method: validation.data.payment_method,
      payment_status: "unpaid",
      customer_name: validation.data.customer_name,
      customer_email: validation.data.customer_email,
      customer_phone: validation.data.customer_phone,
      shipping_address: validation.data.shipping_address,
      city: validation.data.city,
      postal_code: validation.data.postal_code || null,
      notes: validation.data.notes || null,
      subtotal,
      shipping_fee: shippingFee,
      total,
    })
    .select("id, order_number")
    .maybeSingle();

  if (orderError) {
    console.error("Order insert error:", orderError);
    return {
      success: false as const,
      message: orderError.message || "Could not place order. Please try again.",
    };
  }

  const finalOrderId = order?.id || orderId;
  const finalOrderNumber = order?.order_number || orderNumber;

  // 2. Insert Order Items
  const orderItemsData = items.map((item) => ({
    order_id: finalOrderId,
    product_id: item.id,
    product_name: item.name,
    product_image: item.image,
    price: item.price,
    quantity: item.quantity,
    total: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsData);

  if (itemsError) {
    // Log items error; order itself succeeded
    console.error("Order items insertion error:", itemsError);
  }

  // 3. Decrement Product Stock (best-effort)
  for (const item of items) {
    try {
      const { data: product } = await supabase
        .from("products")
        .select("quantity")
        .eq("id", item.id)
        .maybeSingle();

      if (product) {
        const newQty = Math.max(0, product.quantity - item.quantity);
        await supabase
          .from("products")
          .update({ quantity: newQty })
          .eq("id", item.id);
      }
    } catch {
      // Stock decrement non-fatal
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/sales");
  revalidatePath("/admin/users");
  revalidatePath("/admin/product");
  revalidatePath("/account/orders");

  return {
    success: true as const,
    orderId: finalOrderId,
    orderNumber: finalOrderNumber,
    message: "Your order has been placed successfully!",
  };
}

/**
 * Admin action to update order delivery status
 */
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, message: "Authentication required." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "admin") {
    return { success: false as const, message: "Administrator permissions required." };
  }

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (error) {
    return { success: false as const, message: error.message };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/account/orders");

  return { success: true as const, message: `Order status updated to ${status}.` };
}

