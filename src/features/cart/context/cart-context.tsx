"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
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

type CartContextType = {
  items: CartItem[];
  addItem: (product: ProductRecord, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  shippingFee: number;
  total: number;
  isLoaded: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "nivaroa_cart_v1";
const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING_FEE = 10;

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Fallback if parsing fails
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage quota or error handling
    }
  }, [items, isLoaded]);

  // Listen to custom window event if any component emits "cart:add"
  useEffect(() => {
    const handleCustomAdd = (event: Event) => {
      const customEvent = event as CustomEvent<{
        product: ProductRecord;
        quantity?: number;
      }>;
      if (customEvent.detail?.product) {
        addItem(customEvent.detail.product, customEvent.detail.quantity || 1);
      }
    };

    window.addEventListener("cart:add", handleCustomAdd);
    return () => window.removeEventListener("cart:add", handleCustomAdd);
  }, []);

  const addItem = useCallback(
    (product: ProductRecord, quantityToAdd = 1) => {
      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.id === product.id);
        const maxStock = Math.max(1, product.quantity || 99);
        const image =
          product.image_path ||
          (product.images && product.images[0]) ||
          null;

        if (existingIndex > -1) {
          const updated = [...prevItems];
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
          return updated;
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

        return [...prevItems, newItem];
      });
    },
    []
  );

  const removeItem = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, newQuantity: number) => {
      if (newQuantity <= 0) {
        removeItem(productId);
        return;
      }

      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === productId) {
            const capped = Math.min(item.maxQuantity, newQuantity);
            return { ...item, quantity: capped };
          }
          return item;
        })
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Free shipping when subtotal >= $100 or when cart is empty
  const shippingFee =
    items.length === 0 || subtotal >= FREE_SHIPPING_THRESHOLD
      ? 0
      : STANDARD_SHIPPING_FEE;

  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        shippingFee,
        total,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

