"use client";
import { useCart } from "@/store/CartStore";
import Image from "next/image";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { Package, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

export default function ProductClient({
    initialProduct,
}: {
    initialProduct: Product;
}) {
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(initialProduct, quantity); 
        toast.success("Added to cart!");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="aspect-square relative rounded-lg overflow-hidden">
                        <Image
                            src={initialProduct.thumbnail}
                            alt={initialProduct.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {initialProduct.images
                            .slice(0, 4)
                            .map((image: string, index: number) => (
                                <div
                                    key={index}
                                    className="aspect-square relative rounded-md overflow-hidden"
                                >
                                    <Image
                                        src={image}
                                        alt={`${initialProduct.title} - ${
                                            index + 1
                                        }`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <div>
                        <Badge variant="secondary" className="mb-2">
                            {initialProduct.category}
                        </Badge>
                        <h1 className="text-3xl font-bold">
                            {initialProduct.title}
                        </h1>
                        <div className="flex items-center mt-2">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`h-4 w-4 ${
                                            i <
                                            Math.floor(initialProduct.rating)
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                                ({initialProduct.rating.toFixed(1)})
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-3xl font-bold">
                            ${initialProduct.price}
                        </span>
                        {initialProduct.discountPercentage > 0 && (
                            <>
                                <span className="text-sm text-gray-500 line-through">
                                    $
                                    {(
                                        initialProduct.price /
                                        (1 -
                                            initialProduct.discountPercentage /
                                                100)
                                    ).toFixed(2)}
                                </span>
                                <Badge
                                    variant="outline"
                                    className="text-green-600"
                                >
                                    {Math.round(
                                        initialProduct.discountPercentage
                                    )}
                                    % OFF
                                </Badge>
                            </>
                        )}
                    </div>

                    <p className="text-gray-700">
                        {initialProduct.description}
                    </p>

                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-gray-500" />
                        <span className="text-sm">
                            {initialProduct.stock > 0
                                ? `${initialProduct.stock} available`
                                : "Out of stock"}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setQuantity((q) => Math.max(1, q - 1))
                                }
                            >
                                -
                            </Button>
                            <span className="w-8 text-center">{quantity}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setQuantity((q) => q + 1)}
                            >
                                +
                            </Button>
                        </div>
                        <Button
                            onClick={handleAddToCart}
                            disabled={initialProduct.stock === 0}
                            className="flex-1"
                        >
                            <ShoppingCart className="mr-2 h-4 w-4" />
                            {initialProduct.stock === 0
                                ? "Out of Stock"
                                : "Add to Cart"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
