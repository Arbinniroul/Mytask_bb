# E-Commerce Application Documentation

## Overview

This is a Next.js e-commerce application with the following key features:

- Product listing and detail pages
- Shopping cart functionality
- Admin dashboard
- Order management
- Responsive design

## Key Features

### 1. Product Management

#### Product Display
- Product cards with images, title, price, and rating
- Product detail pages with:
  - Image gallery
  - Product information
  - Price with discount display
  - Stock availability
  - Add to cart functionality

#### Product Client Component
```tsx
"use client";
import { useCart } from "@/store/CartStore";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { Package, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

export default function ProductClient({ initialProduct }: { initialProduct: Product }) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(initialProduct, quantity);
        toast.success("Added to cart!");
    };

    // ... rest of the component
}
```

### 2. Shopping Cart System

#### Cart Store (Zustand Implementation)
```tsx
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
            // ... action implementations
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
```

### 3. Admin Dashboard

#### Features
- Product statistics
- Order management
- Low stock alerts
- Recent orders display

#### Admin Dashboard Component
```tsx
"use client";

import AdminRoute from "@/components/AdminRoute";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchOrders, fetchProducts } from "@/lib/api";
import { Order, Product } from "@/types";
import { Package, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const [productsData, ordersData] = await Promise.all([
                fetchProducts(),
                fetchOrders(),
            ]);
            setProducts(productsData);
            setOrders(ordersData);
            setLoading(false);
        }
        loadData();
    }, []);

    // ... rest of the component
}
```

### 4. API Functions

#### Product API
```ts
export async function fetchProducts(): Promise<Product[]> {
    try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        return data.products || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function fetchProductById(id: string): Promise<Product | null> {
    try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const data = await response.json();
        return data || null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}
```

#### Orders API
```ts
export async function fetchOrders(): Promise<Order[]> {
    try {
        const cartStorage = localStorage.getItem('cart-storage');
        if (!cartStorage) return [];
        
        const cartData = JSON.parse(cartStorage);
        const cartState = cartData.state || cartData;
        
        return [{
            id: `local-${Date.now()}`,
            items: cartState.items,
            total: cartState.total,
            createdAt: new Date().toISOString(),
            status: 'pending',
            customer: {
                name: cartData.name || "Guest Customer",
                email: cartData.email || "guest@example.com"
            }
        }];
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}
```

## Getting Started

### Installation
1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

### Running the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

Here is the deployment link: [E-Commerce App on Vercel](https://mytask-au1zp9lyq-orbnirrs-projects.vercel.app/)

## Technical Stack

- **Framework**: Next.js 14 (App Router)
- **State Management**: Zustand
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Persistence**: localStorage
- **Notifications**: Sonner (toasts)

## Folder Structure

```
/src
  /app
    /admin
      /products
      /orders
    /cart
    /products
      /[id]
  /components
    /ui
  /lib
    api.ts
  /store
    CartStore.ts
  /types
    index.ts
```