"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/features/cart/context/cart-context";

type CartBadgeProps = {
  isMobile?: boolean;
};

export default function CartBadge({ isMobile = false }: CartBadgeProps) {
  const { itemCount, isLoaded } = useCart();

  const countDisplay = !isLoaded ? 0 : itemCount;

  if (isMobile) {
    return (
      <Link
        href="/cart"
        aria-label="Shopping bag"
        className="relative grid size-9 place-items-center rounded-xl text-[#35493b] transition hover:bg-[#ebf2e8]"
      >
        <ShoppingBag className="size-4.5" aria-hidden="true" />
        {countDisplay > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid size-4 min-w-[16px] place-items-center rounded-full bg-[#1b4e3a] px-1 text-[9px] font-bold text-white shadow-sm ring-2 ring-white animate-scale-in">
            {countDisplay > 99 ? "99+" : countDisplay}
          </span>
        )}
      </Link>
    );
  }

  return (
    <Link
      href="/cart"
      aria-label="Shopping bag"
      className="relative grid size-10 place-items-center rounded-xl text-[#35493b] transition-all duration-200 hover:bg-[#ebf2e8] hover:text-[#174c3a]"
    >
      <ShoppingBag className="size-5" aria-hidden="true" />
      {countDisplay > 0 && (
        <span className="absolute -right-0.5 -top-0.5 grid size-4.5 min-w-[18px] place-items-center rounded-full bg-[#1b4e3a] px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white animate-scale-in">
          {countDisplay > 99 ? "99+" : countDisplay}
        </span>
      )}
    </Link>
  );
}

