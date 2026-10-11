"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/features/cart/context/cart-context";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    shippingFee,
    total,
    isLoaded,
  } = useCart();

  if (!isLoaded) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-3 border-[#174c3a] border-t-transparent" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#fafbfa] px-4 py-20 text-center">
        <div className="mx-auto max-w-md">
          <div className="mx-auto grid size-20 place-items-center rounded-3xl bg-[#eef4ee] text-[#1c4d36] shadow-xs">
            <ShoppingBag className="size-10 stroke-[1.5]" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-[#162f22] sm:text-3xl">
            Your shopping bag is empty
          </h1>
          <p className="mt-2 text-sm text-[#64796c]">
            Explore our curated departments and discover timeless apparel, footwear, and essentials.
          </p>
          <div className="mt-8">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#174c3a] px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103d31]"
            >
              Start Shopping <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const freeShippingTarget = 100;
  const awayFromFreeShipping = freeShippingTarget - subtotal;

  return (
    <div className="min-h-screen bg-[#fafbfa] pb-24 pt-8 sm:pt-12">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-[#e7eee6] pb-6 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d6e3d5] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#1b4d38] shadow-xs">
              Checkout Bag
            </span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#142e20] sm:text-4xl">
              Shopping Cart ({items.length} {items.length === 1 ? "item" : "items"})
            </h1>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            Clear shopping bag
          </button>
        </div>

        {/* Free Shipping Progress Alert */}
        {awayFromFreeShipping > 0 ? (
          <div className="mb-8 rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 text-xs font-medium text-amber-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <Truck className="size-4.5 text-amber-700 shrink-0" />
              <span>
                Add <strong className="font-bold">${awayFromFreeShipping.toFixed(2)}</strong> more to your order to unlock <strong>Free Delivery</strong>!
              </span>
            </div>
            <Link href="/shop" className="underline font-bold shrink-0">
              Add more
            </Link>
          </div>
        ) : (
          <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-xs font-semibold text-emerald-900 flex items-center gap-2.5">
            <Truck className="size-4.5 text-emerald-700 shrink-0" />
            <span>Congratulations! Your order qualifies for <strong>Free Delivery</strong>.</span>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-[#e8efe8] rounded-3xl border border-[#e4ebe3] bg-white shadow-xs">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                >
                  <div className="flex items-center gap-4">
                    {/* Item Image */}
                    <Link
                      href={`/product/${item.slug || item.id}`}
                      className="relative aspect-square size-20 shrink-0 overflow-hidden rounded-2xl border border-[#e4eee4] bg-[#f8faf8]"
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-contain p-1.5"
                        />
                      ) : (
                        <div className="grid size-full place-items-center text-slate-400">
                          <Package className="size-6" />
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div>
                      {item.categoryName && (
                        <span className="text-[11px] font-medium text-[#708476]">
                          {item.categoryName}
                        </span>
                      )}
                      <Link
                        href={`/product/${item.slug || item.id}`}
                        className="block font-semibold text-[#183425] hover:text-[#174c3a] transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm font-bold text-[#143e2a]">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal */}
                  <div className="flex items-center justify-between sm:justify-end sm:gap-6 pt-2 sm:pt-0 border-t border-[#f2f6f2] sm:border-0">
                    <div className="flex h-10 w-28 items-center justify-between rounded-xl border border-[#d6e3d5] bg-white px-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="grid size-6 place-items-center rounded-lg text-[#314a3a] hover:bg-[#ebf2ea]"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="text-xs font-semibold tabular-nums text-[#193325]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                        className="grid size-6 place-items-center rounded-lg text-[#314a3a] hover:bg-[#ebf2ea] disabled:opacity-40"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>

                    <span className="text-base font-extrabold text-[#153e2b] tabular-nums min-w-[70px] text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="size-4.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#174c3a] hover:underline"
              >
                ← Continue shopping
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-[#e4ede3] bg-white p-6 shadow-xs sm:p-7 sticky top-28">
              <h2 className="text-lg font-bold text-[#143122]">Order Summary</h2>

              <div className="mt-6 space-y-3.5 border-b border-[#ebf2eb] pb-6 text-sm">
                <div className="flex justify-between text-[#536859]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#183526] tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between text-[#536859]">
                  <span>Estimated Delivery</span>
                  <span className="font-semibold tabular-nums">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-700 font-bold uppercase text-xs">
                        Free
                      </span>
                    ) : (
                      `$${shippingFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="rounded-xl bg-[#f7faf7] p-3 text-xs text-[#2c4737] flex items-center gap-2">
                  <span className="size-2 rounded-full bg-emerald-600" />
                  <span><strong>Cash on Delivery (COD)</strong> available</span>
                </div>
              </div>

              {/* Total */}
              <div className="my-6 flex items-baseline justify-between">
                <span className="text-base font-bold text-[#133021]">Total</span>
                <span className="text-2xl font-black text-[#143e2b] tabular-nums">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-[#174c3a] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#103d31] active:scale-99"
              >
                Proceed to Checkout <ArrowRight className="size-4" />
              </Link>

              {/* Assurance badges */}
              <div className="mt-6 space-y-2.5 border-t border-[#edf3ec] pt-5 text-xs text-[#526b5b]">
                <div className="flex items-center gap-2.5">
                  <Truck className="size-4 text-[#174c3a]" />
                  <span>Doorstep delivery across Pakistan</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="size-4 text-[#174c3a]" />
                  <span>Pay with Cash upon inspection</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw className="size-4 text-[#174c3a]" />
                  <span>7-Day Return and Exchange policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

