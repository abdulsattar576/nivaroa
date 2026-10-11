import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  LayoutDashboard,
  Package,
  ShoppingBag,
  Truck,
  User,
  Shield,
} from "lucide-react";
import { UserProxy } from "@/lib/proxy";
import { getUserOrders } from "@/features/orders/data/orders";
import OrderStatusBadge from "@/features/orders/components/order-status-badge";

export const metadata: Metadata = {
  title: "My Account | Nivaroa",
  description: "View your profile, order history, and delivery statuses.",
};

export default async function AccountPage() {
  const session = await UserProxy("/account");
  const orders = await getUserOrders(session.user.id);

  const displayName =
    session.profile.full_name ||
    session.user.email?.split("@")[0] ||
    "Customer";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);
  const activeOrders = orders.filter((o) =>
    ["pending", "confirmed", "processing", "shipped"].includes(o.status)
  );
  const deliveredOrders = orders.filter((o) => o.status === "delivered");

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Profile Banner */}
        <div className="rounded-3xl border border-[#e1ece1] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#174c3a] text-xl font-black text-white shadow-sm sm:size-18">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-extrabold text-[#142f21] sm:text-2xl">
                    {displayName}
                  </h1>
                  {session.profile.role === "admin" && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 ring-1 ring-amber-600/20">
                      <Shield className="size-3" /> Admin
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs text-[#6e8174]">{session.user.email}</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Member since {new Date(session.user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href="/account/orders"
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#d6e3d5] bg-[#f8faf8] px-4 text-xs font-semibold text-[#183f2e] hover:bg-[#ebf2ea] transition"
              >
                <Package className="size-3.5" /> All Orders ({orders.length})
              </Link>

              {session.profile.role === "admin" && (
                <Link
                  href="/admin"
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-[#174c3a] px-4 text-xs font-semibold text-white hover:bg-[#103d31] transition"
                >
                  <LayoutDashboard className="size-3.5" /> Admin Portal
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Quick Statistics */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e4ede3] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#768a7c]">
                Total Orders Placed
              </span>
              <Package className="size-4 text-[#174c3a]" />
            </div>
            <p className="mt-2 text-2xl font-black text-[#153424] tabular-nums">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e4ede3] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#768a7c]">
                Active In-Transit Orders
              </span>
              <Truck className="size-4 text-amber-600" />
            </div>
            <p className="mt-2 text-2xl font-black text-amber-800 tabular-nums">
              {activeOrders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-[#e4ede3] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#768a7c]">
                Completed Orders
              </span>
              <ShoppingBag className="size-4 text-emerald-700" />
            </div>
            <p className="mt-2 text-2xl font-black text-emerald-800 tabular-nums">
              {deliveredOrders.length}
            </p>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="mt-10">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#143021]">Recent Orders</h2>
              <p className="text-xs text-[#6e8274]">
                Track order delivery and cash on delivery statuses.
              </p>
            </div>
            {orders.length > 3 && (
              <Link
                href="/account/orders"
                className="text-xs font-semibold text-[#174c3a] hover:underline"
              >
                View all orders ({orders.length}) →
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#ccd9cc] bg-white p-12 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#eff4ef] text-[#1c4d36]">
                <Package className="size-8" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#163023]">
                You haven&apos;t placed any orders yet
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs text-[#6a7d71]">
                Explore our catalog, add items to your cart, and experience easy Cash on Delivery.
              </p>
              <div className="mt-6">
                <Link
                  href="/shop"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#174c3a] px-6 text-xs font-semibold text-white hover:bg-[#103d31]"
                >
                  Start Shopping <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-[#e2eae1] bg-white p-5 shadow-xs transition hover:border-[#b4cdb8] sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#f0f4ef] pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-extrabold text-[#173827]">
                          {order.order_number}
                        </span>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      <p className="mt-1 text-xs text-[#738578]">
                        Placed on {new Date(order.created_at).toLocaleDateString()} at{" "}
                        {new Date(order.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 sm:text-right">
                      <div>
                        <p className="text-xs text-[#718577]">Order Total</p>
                        <p className="text-base font-black text-[#143d2b] tabular-nums">
                          ${Number(order.total).toFixed(2)}
                        </p>
                      </div>
                      <Link
                        href={`/orders/${order.order_number}/success`}
                        className="rounded-xl border border-[#d6e3d5] bg-[#f8faf8] px-3.5 py-2 text-xs font-semibold text-[#183e2d] hover:bg-[#ebf2ea] transition"
                      >
                        Details
                      </Link>
                    </div>
                  </div>

                  {/* Order items thumbnails row */}
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {(order.items || []).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-2.5 rounded-xl bg-[#f9fbf9] p-2 border border-[#eef3ee]"
                      >
                        <div className="relative aspect-square size-10 shrink-0 overflow-hidden rounded-lg bg-white border border-[#e8efe8]">
                          {item.product_image ? (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              fill
                              sizes="40px"
                              className="object-contain p-0.5"
                            />
                          ) : (
                            <div className="grid size-full place-items-center text-slate-400">
                              <Package className="size-3" />
                            </div>
                          )}
                        </div>
                        <div className="pr-1 text-xs">
                          <p className="truncate font-medium text-[#1c3527] max-w-[140px] sm:max-w-[200px]">
                            {item.product_name}
                          </p>
                          <p className="text-[10px] text-[#788a7e]">
                            Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Destination */}
                  <div className="mt-3.5 flex items-center gap-2 text-xs text-[#6e8174]">
                    <Truck className="size-3.5 text-[#174c3a]" />
                    <span>
                      Delivery to {order.shipping_address}, {order.city} (Cash on Delivery)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

