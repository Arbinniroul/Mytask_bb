import { Order, Product } from "@/types";

export async function fetchProducts(): Promise<Product[]> {
    const url = "https://dummyjson.com/products";
    const options = {
        method: "GET",
        headers: { accept: "application/json" },
    };

    try {
        const response = await fetch(url, options);
        const json = await response.json();
        const rawProducts = json?.products;

        if (!Array.isArray(rawProducts)) return [];

        // Normalize the product data
        const products = rawProducts.map((product) => ({
            ...product,
            images: Array.isArray(product.images)
                ? product.images
                : product.thumbnail
                ? [product.thumbnail]
                : [],
        }));

        return products;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

export async function fetchProductById(id: string): Promise<Product | null> {
    try {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch product");
        }
        const data = await response.json();
        return data || null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

export async function fetchOrders(): Promise<Order[]> {
    try {
        const cartStorage = localStorage.getItem("cart-storage");

        if (!cartStorage) {
            return [];
        }

        const cartData = JSON.parse(cartStorage);

        const cartState = cartData.state || cartData;

        const orders: Order[] = [
            {
                id: cartState.id || "HardcodedId",
                items: cartState.items,
                total: cartState.total,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: "pending",
                customer: {
                    name: cartData.name,
                    email: cartData.email,
                    address: cartData.address,
                    phone: cartData.phone,
                },
            },
        ];

        return orders;
    } catch (error) {
        console.error("Error fetching orders from localStorage:", error);
        return [];
    }
}
