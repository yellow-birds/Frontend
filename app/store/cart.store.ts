import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "~/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => boolean; // returns false if already in cart
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (variantId: string) => boolean;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem(item) {
        const existing = get().items.find((i) => i.variantId === item.variantId);
        if (existing) return false; // already in cart — caller shows toast
        set((state) => ({ items: [...state.items, item] }));
        return true;
      },

      removeItem(variantId) {
        set((state) => ({
          items: state.items.filter((i) => i.variantId !== variantId),
        }));
      },

      updateQuantity(variantId, quantity) {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variantId === variantId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart() {
        set({ items: [] });
      },

      isInCart(variantId) {
        return get().items.some((i) => i.variantId === variantId);
      },

      totalItems() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0);
      },

      totalPrice() {
        return get().items.reduce(
          (sum, i) => sum + i.unitPrice * i.quantity,
          0
        );
      },
    }),
    { name: "yb-cart" }
  )
);
