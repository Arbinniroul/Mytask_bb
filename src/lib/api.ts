import {  Product } from "@/types";



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




