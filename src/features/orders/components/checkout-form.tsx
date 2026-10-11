"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Banknote,
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  Lock,
  Package,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useCart } from "@/features/cart/context/cart-context";
import {
  CheckoutSchema,
  type CheckoutFormData,
} from "../schemas/order.schema";
import { createOrder } from "../actions/orders";

type CheckoutFormProps = {
  initialUserData?: {
    name?: string;
    email?: string;
  };
};

export default function CheckoutForm({ initialUserData }: CheckoutFormProps) {
  const router = useRouter();
  const { items, subtotal, shippingFee, total, clearCart, isLoaded } = useCart();
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      customer_name: initialUserData?.name || "",
      customer_email: initialUserData?.email || "",
      customer_phone: "",
      shipping_address: "",
      city: "Karachi",
      postal_code: "",
      notes: "",
      payment_method: "cod",
    },
  });

  const selectedPayment = watch("payment_method");

  const onSubmit = async (values: CheckoutFormData) => {
    if (items.length === 0) {
      setServerError("Your shopping cart is empty.");
      return;
    }

    setServerError("");
    setIsSubmitting(true);

    try {
      const cartItemsInput = items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: item.quantity,
      }));

      const result = await createOrder(values, cartItemsInput);

      if (!result.success) {
        setServerError(result.message);
        setIsSubmitting(false);
        return;
      }

      // Clear the local cart
      clearCart();

      // Navigate to order confirmation success page
      router.push(`/orders/${result.orderNumber}/success`);
    } catch {
      setServerError("Something went wrong placing your order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-3 border-[#174c3a] border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] py-16 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#eff4ef] text-[#1c4d36]">
            <ShoppingBag className="size-8" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[#142e20]">
            No items to checkout
          </h2>
          <p className="mt-2 text-sm text-[#667a6d]">
            Your shopping bag is currently empty. Add products to proceed with checkout.
          </p>
          <div className="mt-6">
            <Link
              href="/shop"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-[#174c3a] px-6 text-sm font-semibold text-white hover:bg-[#103d31]"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left Column: Delivery Details & Payment */}
        <div className="space-y-8 lg:col-span-7">
          {/* 1. Contact & Customer Information */}
          <div className="rounded-3xl border border-[#e4ede3] bg-white p-6 shadow-xs sm:p-7">
            <h2 className="text-base font-bold text-[#163324] sm:text-lg">
              1. Contact & Recipient Details
            </h2>
            <p className="mt-1 text-xs text-[#6e8073]">
              We will send order confirmation and delivery status SMS/email to these details.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="customer_name"
                  className="text-xs font-semibold uppercase tracking-wider text-[#26372f]"
                >
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="customer_name"
                  type="text"
                  placeholder="e.g. Abdul Sattar"
                  {...register("customer_name")}
                  className="h-11 w-full rounded-xl border border-[#dce5de] bg-white px-3.5 text-sm text-[#1b3024] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
                />
                {errors.customer_name && (
                  <p className="text-xs text-rose-600">{errors.customer_name.message}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label
                  htmlFor="customer_email"
                  className="text-xs font-semibold uppercase tracking-wider text-[#26372f]"
                >
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="customer_email"
                  type="email"
                  placeholder="name@example.com"
                  {...register("customer_email")}
                  className="h-11 w-full rounded-xl border border-[#dce5de] bg-white px-3.5 text-sm text-[#1b3024] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
                />
                {errors.customer_email && (
                  <p className="text-xs text-rose-600">{errors.customer_email.message}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label
                  htmlFor="customer_phone"
                  className="text-xs font-semibold uppercase tracking-wider text-[#26372f]"
                >
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  id="customer_phone"
                  type="tel"
                  placeholder="0300 1234567"
                  {...register("customer_phone")}
                  className="h-11 w-full rounded-xl border border-[#dce5de] bg-white px-3.5 text-sm text-[#1b3024] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
                />
                {errors.customer_phone && (
                  <p className="text-xs text-rose-600">{errors.customer_phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="rounded-3xl border border-[#e4ede3] bg-white p-6 shadow-xs sm:p-7">
            <h2 className="text-base font-bold text-[#163324] sm:text-lg">
              2. Shipping Address
            </h2>
            <p className="mt-1 text-xs text-[#6e8073]">
              Where should our courier deliver your package?
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="shipping_address"
                  className="text-xs font-semibold uppercase tracking-wider text-[#26372f]"
                >
                  Street Address & House / Flat # <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="shipping_address"
                  rows={2}
                  placeholder="House #, Street name, Sector / Area / Landmark"
                  {...register("shipping_address")}
                  className="w-full rounded-xl border border-[#dce5de] bg-white p-3.5 text-sm text-[#1b3024] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
                />
                {errors.shipping_address && (
                  <p className="text-xs text-rose-600">{errors.shipping_address.message}</p>
                )}
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label
                  htmlFor="city"
                  className="text-xs font-semibold uppercase tracking-wider text-[#26372f]"
                >
                  City <span className="text-rose-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g. Karachi, Lahore, Islamabad"
                  {...register("city")}
                  className="h-11 w-full rounded-xl border border-[#dce5de] bg-white px-3.5 text-sm text-[#1b3024] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
                />
                {errors.city && (
                  <p className="text-xs text-rose-600">{errors.city.message}</p>
                )}
              </div>

              {/* Postal Code */}
              <div className="space-y-1.5">
                <label
                  htmlFor="postal_code"
                  className="text-xs font-semibold uppercase tracking-wider text-[#26372f]"
                >
                  Postal Code (Optional)
                </label>
                <input
                  id="postal_code"
                  type="text"
                  placeholder="e.g. 75500"
                  {...register("postal_code")}
                  className="h-11 w-full rounded-xl border border-[#dce5de] bg-white px-3.5 text-sm text-[#1b3024] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
                />
              </div>

              {/* Delivery Notes */}
              <div className="space-y-1.5 sm:col-span-2">
                <label
                  htmlFor="notes"
                  className="text-xs font-semibold uppercase tracking-wider text-[#26372f]"
                >
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  id="notes"
                  type="text"
                  placeholder="e.g. Please call before arriving or leave with security."
                  {...register("notes")}
                  className="h-11 w-full rounded-xl border border-[#dce5de] bg-white px-3.5 text-sm text-[#1b3024] outline-none transition focus:border-[#438060] focus:ring-4 focus:ring-[#438060]/10"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="rounded-3xl border border-[#e4ede3] bg-white p-6 shadow-xs sm:p-7">
            <h2 className="text-base font-bold text-[#163324] sm:text-lg">
              3. Payment Method
            </h2>
            <p className="mt-1 text-xs text-[#6e8073]">
              Choose how you would like to pay for your order.
            </p>

            <div className="mt-5 space-y-3">
              {/* Cash on Delivery (Active) */}
              <label
                className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all ${
                  selectedPayment === "cod"
                    ? "border-[#174c3a] bg-[#f6f9f6] ring-1 ring-[#174c3a]"
                    : "border-[#e0e8e0] hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  value="cod"
                  {...register("payment_method")}
                  className="mt-1 size-4 accent-[#174c3a]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#153223]">
                      Cash on Delivery (COD)
                    </span>
                    <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      Recommended
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#5a7062]">
                    Pay with physical cash directly to the courier upon delivery at your doorstep.
                  </p>
                </div>
                <Banknote className="size-6 text-[#174c3a] shrink-0" />
              </label>

              {/* Easypaisa (Pending Verification) */}
              <div className="flex items-start gap-4 rounded-2xl border border-dashed border-[#dce5dc] bg-[#fafbfa] p-4 opacity-75">
                <input
                  type="radio"
                  disabled
                  className="mt-1 size-4 cursor-not-allowed"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-slate-700">
                      Easypaisa Mobile Wallet
                    </span>
                    <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                      Account Under Approval
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Direct wallet payment will be activated once our merchant verification is finalized. Please use Cash on Delivery.
                  </p>
                </div>
              </div>

              {/* Card Payment (Coming Soon) */}
              <div className="flex items-start gap-4 rounded-2xl border border-dashed border-[#dce5dc] bg-[#fafbfa] p-4 opacity-60">
                <input
                  type="radio"
                  disabled
                  className="mt-1 size-4 cursor-not-allowed"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700">
                      Credit / Debit Card
                    </span>
                    <span className="rounded-md bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                      Coming Soon
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Visa and Mastercard gateway integration in progress.
                  </p>
                </div>
                <CreditCard className="size-5 text-slate-400 shrink-0" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 rounded-3xl border border-[#e4ede3] bg-white p-6 shadow-xs sm:p-7">
            <h2 className="text-lg font-bold text-[#143122]">
              Order Summary ({items.length})
            </h2>

            {/* Items scroll */}
            <div className="mt-5 max-h-72 divide-y divide-[#eef3ee] overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3.5 py-3">
                  <div className="relative aspect-square size-14 shrink-0 overflow-hidden rounded-xl border border-[#e6eee6] bg-[#f9fbf9]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
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
                    <p className="truncate text-xs font-semibold text-[#183526]">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-[#718577]">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-[#143c2a] tabular-nums">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="mt-6 space-y-3 border-t border-[#ebf2eb] pt-5 text-sm">
              <div className="flex justify-between text-[#556b5b]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#163324] tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-[#556b5b]">
                <span>Delivery Fee</span>
                <span className="font-semibold tabular-nums">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-xs">
                      Free Delivery
                    </span>
                  ) : (
                    `$${shippingFee.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex items-baseline justify-between border-t border-[#edf3ec] pt-3">
                <span className="text-base font-bold text-[#143021]">Total</span>
                <span className="text-2xl font-black text-[#143e2b] tabular-nums">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {serverError && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-700">
                {serverError}
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#174c3a] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103d31] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  <span>Placing Order…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-4.5" />
                  <span>Place Order with Cash on Delivery</span>
                </>
              )}
            </button>

            <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[#697d70]">
              <Lock className="size-3.5 text-[#174c3a]" />
              <span>Safe & Encrypted 256-bit Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

