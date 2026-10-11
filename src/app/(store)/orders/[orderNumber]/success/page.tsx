import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Banknote,
  CheckCircle2,
  Package,
  ShoppingBag,
  Truck,
  ArrowRight,
  Clock,
} from "lucide-react";
import { getOrderByNumber } from "@/features/orders/data/orders";

type OrderSuccessPageProps = {
  params: Promise<{ orderNumber: string }>;
};

export const metadata: Metadata = {
  title: "Order Placed Successfully | Nivaroa",
  description: "Thank you for your order with Nivaroa.",
};

export default async function OrderSuccessPage({
  params,
}: OrderSuccessPageProps) {
  const { orderNumber } = await params;
  const order = await getOrderByNumber(orderNumber);

  if (!order) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-24 pt-8 sm:pt-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-8">
        {/* Success Hero Header */}
        <div className="rounded-3xl border border-[#d8e6d8] bg-white p-8 text-center shadow-xs sm:p-10">
          <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-[#edf5ed] text-[#1a513c]">
            <CheckCircle2 className="size-11" />
          </div>

          <span className="mt-6 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            Order Confirmed
          </span>

          <h1 className="mt-3 text-2xl font-black tracking-tight text-[#142e20] sm:text-3xl">
            Thank You, {order.customer_name.split(" ")[0]}!
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#5d7265]">
            Your order has been received and is now being packaged. You will pay with <strong>Cash on Delivery</strong> when the courier arrives.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-[#d6e3d5] bg-[#f7faf7] px-5 py-3">
            <span className="text-xs text-[#6e8073]">Order Reference:</span>
            <span className="font-mono text-base font-extrabold text-[#173e2c]">
              {order.order_number}
            </span>
          </div>
        </div>

        {/* Delivery & Payment Badges */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* Estimated Delivery */}
          <div className="rounded-2xl border border-[#e4ede3] bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#eef5ee] text-[#174c3a]">
                <Truck className="size-5" />
              </div>
              <div>
                <p className="text-xs text-[#708476]">Estimated Delivery</p>
                <p className="text-sm font-bold text-[#173324]">2–4 Business Days</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-[#667a6d]">
              Our dispatch team will notify you via SMS when out for delivery.
            </p>
          </div>

          {/* Payment Status */}
          <div className="rounded-2xl border border-[#e4ede3] bg-white p-5 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-xl bg-[#eef5ee] text-[#174c3a]">
                <Banknote className="size-5" />
              </div>
              <div>
                <p className="text-xs text-[#708476]">Payment Method</p>
                <p className="text-sm font-bold text-[#173324]">
                  Cash on Delivery (PKR / USD)
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs text-[#667a6d]">
              Please have exact cash ready for the courier. Total: <strong>${order.total.toFixed(2)}</strong>
            </p>
          </div>
        </div>

        {/* Order Details & Summary Card */}
        <div className="mt-6 rounded-3xl border border-[#e4ede3] bg-white p-6 shadow-xs sm:p-8">
          <h2 className="text-base font-bold text-[#143021]">Order Summary</h2>

          {/* Items List */}
          <div className="mt-5 divide-y divide-[#edf3ed] border-y border-[#edf3ed]">
            {(order.items || []).map((item) => (
              <div key={item.id} className="flex items-center gap-4 py-4">
                <div className="relative aspect-square size-14 shrink-0 overflow-hidden rounded-xl border border-[#e4ede4] bg-[#f7f9f7]">
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
                    Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                  </p>
                </div>

                <span className="text-xs font-bold text-[#143e2b] tabular-nums">
                  ${(Number(item.price) * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Cost Breakdown */}
          <div className="mt-5 space-y-2.5 text-xs text-[#526859]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#163324] tabular-nums">
                ${Number(order.subtotal).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="font-semibold text-[#163324] tabular-nums">
                {Number(order.shipping_fee) === 0 ? "Free" : `$${Number(order.shipping_fee).toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#edf3ec] pt-3 text-sm font-bold text-[#143021]">
              <span>Total to Pay</span>
              <span className="text-lg font-black text-[#143e2b] tabular-nums">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Shipping Recipient Info */}
          <div className="mt-8 rounded-2xl bg-[#fafcfa] p-5 text-xs text-[#405649] border border-[#e8efe8]">
            <h3 className="font-bold text-[#1a3828] text-sm mb-2">Shipping To</h3>
            <p className="font-medium text-[#1c3325]">{order.customer_name}</p>
            <p className="mt-0.5">{order.shipping_address}, {order.city}</p>
            <p className="mt-0.5">Phone: {order.customer_phone}</p>
            <p className="mt-0.5">Email: {order.customer_email}</p>
            {order.notes && (
              <p className="mt-2 italic text-[#637a6c]">Notes: &ldquo;{order.notes}&rdquo;</p>
            )}
          </div>
        </div>

        {/* Next Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/shop"
            className="w-full sm:w-auto text-center text-xs font-semibold text-[#174c3a] hover:underline"
          >
            ← Return to Store
          </Link>

          <Link
            href="/account/orders"
            className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#174c3a] px-7 text-xs font-semibold text-white shadow-sm hover:bg-[#103d31] transition"
          >
            Track in My Account <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

