"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/store/CartStore";
import { Product } from "@/types";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart(product);
    };

    return (
        <Link href={`/product/${product.id}`}>
            <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                <CardHeader className="p-0">
                    <div className="aspect-square relative overflow-hidden rounded-t-lg">
                        <Image
                            src={
                                product.images[1] ||
                                product.images[2] ||
                                product.images[0]
                            }
                            alt={product.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        {product.stock <= 5 && (
                            <Badge className="absolute top-2 right-2 bg-red-500">
                                Low Stock
                            </Badge>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2 line-clamp-2">
                        {product.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-blue-600">
                            ${product.price}
                        </span>
                        {product.rating && (
                            <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="ml-1 text-sm text-gray-600">
                                    {product.rating}
                                </span>
                            </div>
                        )}
                    </div>
                    <Badge variant="secondary" className="mt-2">
                        {product.category}
                    </Badge>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <Button
                        onClick={handleAddToCart}
                        className="w-full"
                        disabled={product.stock === 0}
                    >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </Button>
                </CardFooter>
            </Card>
        </Link>
    );
}
