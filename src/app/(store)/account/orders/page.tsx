import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Banknote,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { UserProxy } from "@/lib/proxy";
import { getUserOrders } from "@/features/orders/data/orders";
import OrderStatusBadge from "@/features/orders/components/order-status-badge";

export const metadata: Metadata = {
  title: "My Orders | Nivaroa",
  description: "Track your orders, delivery progress, and purchase history.",
};

export default async function AccountOrdersPage() {
  const session = await UserProxy("/account/orders");
  const orders = await getUserOrders(session.user.id);

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#174c3a] hover:underline"
          >
            <ArrowLeft className="size-3.5" /> Back to Account Dashboard
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8 border-b border-[#e7efe7] pb-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1b4d38] shadow-xs">
            Purchase History
          </span>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#142e20] sm:text-4xl">
            My Orders ({orders.length})
          </h1>
          <p className="mt-1 text-sm text-[#617669]">
            Review your past purchases, shipment status, and Cash on Delivery details.
          </p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#ccd9cc] bg-white p-16 text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#eff4ef] text-[#1c4d36]">
              <Package className="size-8" />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[#163023]">
              No orders found
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-xs text-[#6a7d71]">
              You haven&apos;t placed any orders yet. Once you make an order, you can track it here.
            </p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#174c3a] px-6 text-xs font-semibold text-white hover:bg-[#103d31]"
              >
                Explore Shop
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-3xl border border-[#e1eae0] bg-white shadow-xs transition hover:border-[#b4cdb8]"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col gap-3 border-b border-[#edf3ec] bg-[#fbfdfb] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-extrabold text-[#163826]">
                        {order.order_number}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 text-xs text-[#718677]">
                      Ordered on {new Date(order.created_at).toLocaleDateString()} at{" "}
                      {new Date(order.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:text-right">
                    <div>
                      <p className="text-[11px] text-[#718577]">Total (COD)</p>
                      <p className="text-lg font-black text-[#143e2b] tabular-nums">
                        ${Number(order.total).toFixed(2)}
                      </p>
                    </div>

                    <Link
                      href={`/orders/${order.order_number}/success`}
                      className="rounded-xl border border-[#d6e3d5] bg-white px-3.5 py-2 text-xs font-semibold text-[#183e2d] hover:bg-[#eff4ee] transition shadow-xs"
                    >
                      View Receipt
                    </Link>
                  </div>
                </div>

                {/* Items in order */}
                <div className="divide-y divide-[#edf3ed] px-5 sm:px-6">
                  {(order.items || []).map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-4">
                      <div className="relative aspect-square size-14 shrink-0 overflow-hidden rounded-xl border border-[#e4ede4] bg-[#f8faf8]">
                        {item.product_image ? (
                          <Image
                            src={item.product_image}
                            alt={item.product_name}
                            fill
                            sizes="56px"
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="grid size-full place-items-center text-slate-400">
                            <Package className="size-4" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-[#183426]">
                          {item.product_name}
                        </p>
                        <p className="text-[11px] text-[#718578]">
                          Quantity: {item.quantity} × ${Number(item.price).toFixed(2)}
                        </p>
                      </div>

                      <span className="text-xs font-bold text-[#143e2b] tabular-nums">
                        ${(Number(item.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer details */}
                <div className="border-t border-[#edf3ec] bg-[#fafcfa] p-4 text-xs text-[#526a5b] sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Truck className="size-3.5 text-[#174c3a]" />
                    <span>
                      Delivery: <strong>{order.shipping_address}, {order.city}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote className="size-3.5 text-[#174c3a]" />
                    <span>
                      Payment: <strong>Cash on Delivery (${Number(order.total).toFixed(2)})</strong>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

