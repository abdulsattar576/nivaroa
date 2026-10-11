"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProductRecord } from "@/features/products/schemas/product.schema";

export type CartItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  quantity: number;
  maxQuantity: number;
  categoryName?: string;
};

export const CART_STORAGE_KEY = "nivaroa_cart_v1";
export const FREE_SHIPPING_THRESHOLD = 100;
export const STANDARD_SHIPPING_FEE = 10;

export interface CartStore {
  items: CartItem[];
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  addItem: (product: ProductRecord, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),

      addItem: (product: ProductRecord, quantityToAdd = 1) => {
        const { items } = get();
        const existingIndex = items.findIndex((item) => item.id === product.id);
        const maxStock = Math.max(1, product.quantity || 99);
        const image =
          product.image_path ||
          (product.images && product.images[0]) ||
          null;

        if (existingIndex > -1) {
          const updated = [...items];
          const existing = updated[existingIndex];
          const newQuantity = Math.min(
            maxStock,
            existing.quantity + quantityToAdd
          );
          updated[existingIndex] = {
            ...existing,
            quantity: newQuantity,
            maxQuantity: maxStock,
          };
          set({ items: updated });
          return;
        }

        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          slug: product.slug || product.id,
          price: product.price,
          image,
          quantity: Math.min(maxStock, Math.max(1, quantityToAdd)),
          maxQuantity: maxStock,
          categoryName: product.category?.name,
        };

        set({ items: [...items, newItem] });
      },

      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) => {
            if (item.id === productId) {
              const capped = Math.min(item.maxQuantity, newQuantity);
              return { ...item, quantity: capped };
            }
            return item;
          }),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getShippingFee: () => {
        const { items } = get();
        const subtotal = get().getSubtotal();
        return items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
          ? 0
          : STANDARD_SHIPPING_FEE;
      },

      getTotal: () => {
        return get().getSubtotal() + get().getShippingFee();
      },
    }),
    {
      name: CART_STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/**
 * Hydration-safe React hook matching the previous useCart interface.
 * Guarantees zero SSR hydration mismatches by synchronizing after client mount.
 */
export function useCart() {
  const items = useCartStore((state) => state.items);
  const _hasHydrated = useCartStore((state) => state._hasHydrated);
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!useCartStore.getState()._hasHydrated) {
      useCartStore.getState().setHasHydrated(true);
    }
  }, []);

  const isLoaded = isMounted && _hasHydrated;

  const itemCount = isLoaded
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;

  const subtotal = isLoaded
    ? items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const shippingFee =
    !isLoaded || items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;

  const total = subtotal + shippingFee;

  return {
    items: isLoaded ? items : [],
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    shippingFee,
    total,
    isLoaded,
  };
}

