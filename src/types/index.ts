export interface Product {
    id: number; 
    title: string;
    description: string;
    quantity?: number;
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
    id: string;
    customer: {
        name: string;
        email: string;
        address: string;
        phone:number
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
export interface TailwindVariant {
    variant?:
        | "secondary"
        | "default"
        | "outline"
        | "destructive"
        | null
        | undefined;
}
