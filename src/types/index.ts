export interface Product {
    id: number; 
    title: string;
    description: string;
    price: number;
    thumbnail: string;
    images: string[];
    category: string;
    stock: number;
    rating: number;
    brand: string;
    discountPercentage: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
    _id: string;
    customer: {
        name: string;
        email: string;
        address: string;
    };
    items: CartItem[];
    total: number;
    status: "pending" | "processing" | "shipped" | "delivered";
    createdAt: string;
    updatedAt: string;
}

export interface User {
    email: string;
    role: "admin" | "customer";
}
