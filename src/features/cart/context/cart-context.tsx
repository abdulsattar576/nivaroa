"use client";

import { useEffect, type ReactNode } from "react";
import { useCartStore } from "../store/cart-store";
import type { ProductRecord } from "@/features/products/schemas/product.schema";

export * from "../store/cart-store";

/**
 * Backward-compatible CartProvider wrapper.
 * Zustand stores are globally accessible without context providers,
 * but CartProvider sets up the global custom window event listener for 'cart:add'.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const handleCustomAdd = (event: Event) => {
      const customEvent = event as CustomEvent<{
        product: ProductRecord;
        quantity?: number;
      }>;
      if (customEvent.detail?.product) {
        useCartStore.getState().addItem(
          customEvent.detail.product,
          customEvent.detail.quantity || 1
        );
      }
    };

    window.addEventListener("cart:add", handleCustomAdd);
    return () => window.removeEventListener("cart:add", handleCustomAdd);
  }, []);

  return <>{children}</>;
}
