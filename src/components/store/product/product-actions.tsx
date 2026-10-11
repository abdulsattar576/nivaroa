"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";
import type { ProductRecord } from "@/features/products/schemas/product.schema";

type ProductActionsProps = {
  product: ProductRecord;
};

export default function ProductActions({ product }: ProductActionsProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const isOutOfStock = product.quantity <= 0;
  const isLowStock = !isOutOfStock && product.quantity <= 5;
  const maxAllowed = Math.max(1, Math.min(product.quantity, 10));

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(maxAllowed, prev + 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    // Simple temporary notification / local event (ready for global cart integration)
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);

    // Dispatch a custom event so other components (e.g., cart badge) can listen if needed
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cart:add", {
          detail: { product, quantity },
        })
      );
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    setIsBuying(true);
    handleAddToCart();
    // Navigate to checkout or cart
    router.push("/cart");
  };

  return (
    <div className="space-y-6">
      {/* Live Stock Indicator */}
      <div className="flex items-center gap-2.5">
        {isOutOfStock ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            <span className="size-2 rounded-full bg-rose-600" />
            Out of Stock
          </div>
        ) : isLowStock ? (
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            <span className="size-2 animate-ping rounded-full bg-amber-500" />
            Only {product.quantity} left — Order soon!
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
            <span className="size-2 rounded-full bg-emerald-500" />
            In Stock ({product.quantity} available)
          </div>
        )}
      </div>

      {/* Quantity & Cart Actions */}
      <div className="space-y-3.5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Quantity Selector */}
          <div className="flex h-12 w-full sm:w-36 items-center justify-between rounded-xl border border-[#d6e3d7] bg-white px-2 shadow-xs">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={isOutOfStock || quantity <= 1}
              aria-label="Decrease quantity"
              className="grid size-8 place-items-center rounded-lg text-[#324b3c] transition hover:bg-[#edf3ed] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="font-semibold text-[#183124] text-sm tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={isOutOfStock || quantity >= maxAllowed}
              aria-label="Increase quantity"
              className="grid size-8 place-items-center rounded-lg text-[#324b3c] transition hover:bg-[#edf3ed] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`group flex h-12 flex-1 items-center justify-center gap-2.5 rounded-xl px-6 text-sm font-semibold transition-all duration-200 shadow-sm ${
              isOutOfStock
                ? "cursor-not-allowed bg-slate-200 text-slate-500 shadow-none"
                : isAdded
                ? "bg-emerald-700 text-white"
                : "bg-[#174c3a] text-white hover:bg-[#103d31] active:scale-99"
            }`}
          >
            {isAdded ? (
              <>
                <Check className="size-4.5" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="size-4.5 transition-transform group-hover:-translate-y-0.5" />
                <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
              </>
            )}
          </button>
        </div>

        {/* Buy Now Button */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isBuying}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#174c3a] bg-[#f2f7f3] px-6 text-sm font-semibold text-[#174c3a] transition hover:bg-[#e4efe6] active:scale-99"
          >
            <Zap className="size-4 fill-current" />
            <span>{isBuying ? "Redirecting…" : "Buy Now"}</span>
          </button>
        )}
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl border border-[#e2ece2] bg-[#fbfdfb] p-4 text-xs sm:grid-cols-3">
        <div className="flex items-center gap-2.5 text-[#2b4435]">
          <Truck className="size-4 shrink-0 text-[#174c3a]" />
          <span>Free delivery over $100</span>
        </div>
        <div className="flex items-center gap-2.5 text-[#2b4435]">
          <RotateCcw className="size-4 shrink-0 text-[#174c3a]" />
          <span>30-day easy returns</span>
        </div>
        <div className="flex items-center gap-2.5 text-[#2b4435]">
          <ShieldCheck className="size-4 shrink-0 text-[#174c3a]" />
          <span>100% genuine quality</span>
        </div>
      </div>
    </div>
  );
}

