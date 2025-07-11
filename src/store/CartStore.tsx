"use client";

import { CartItem, Product } from "@/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CartStore {
    items: CartItem[];
    total: number;
    itemCount: number;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (productId: string | number) => void;
    updateQuantity: (productId: string | number, quantity: number) => void;
    clearCart: () => void;
}

const calculateTotals = (items: CartItem[]) => {
    const total = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, itemCount };
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            total: 0,
            itemCount: 0,

            addToCart: (product, quantity = 1) => {
                const existingItem = get().items.find(
                    (item) =>
                        item.product.id.toString() === product.id.toString()
                );

                let newItems: CartItem[];
                if (existingItem) {
                    newItems = get().items.map((item) =>
                        item.product.id.toString() === product.id.toString()
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    newItems = [...get().items, { product, quantity }];
                }

                set({
                    items: newItems,
                    ...calculateTotals(newItems),
                });
            },

            removeFromCart: (productId) => {
                const newItems = get().items.filter(
                    (item) =>
                        item.product.id.toString() !== productId.toString()
                );
                set({
                    items: newItems,
                    ...calculateTotals(newItems),
                });
            },

            updateQuantity: (productId, quantity) => {
                const newItems = get()
                    .items.map((item) =>
                        item.product.id.toString() === productId.toString()
                            ? { ...item, quantity: Math.max(0, quantity) }
                            : item
                    )
                    .filter((item) => item.quantity > 0);

                set({
                    items: newItems,
                    ...calculateTotals(newItems),
                });
            },

            clearCart: () => {
                set({ items: [], total: 0, itemCount: 0 });
            },
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export function useCart() {
    return useCartStore();
}
