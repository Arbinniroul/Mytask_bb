"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/CartStore";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
    const { items, total, updateQuantity, removeFromCart, itemCount } =
        useCart();

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Your cart is empty
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Add some items to your cart to get started.
                    </p>
                    <Link href="/">
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Shopping Cart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <Card key={item.product.id}>
                            <CardContent className="p-4">
                                <div className="flex items-center space-x-4">
                                    <div className="relative w-20 h-20 rounded-md overflow-hidden">
                                        <Image
                                            src={
                                                item.product.images[0] ||
                                                item.product.images[1] ||
                                                item.product.images[2]
                                            }
                                            alt={item.product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/product/${item.product.id}`}
                                        >
                                            <h3 className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer">
                                                {item.product.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {item.product.category}
                                        </p>
                                        <p className="text-lg font-bold text-blue-600 mt-2">
                                            ${item.product.price}
                                        </p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product.id.toString(),
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-8 text-center">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                updateQuantity(
                                                    item.product.id.toString(),
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">
                                            $
                                            {(
                                                item.product.price *
                                                item.quantity
                                            ).toFixed(2)}
                                        </p>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                removeFromCart(
                                                    item.product.id.toString()
                                                )
                                            }
                                            className="text-red-600 hover:text-red-700 mt-2"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal ({itemCount} items)</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>Free</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <Link href="/checkout">
                                <Button className="w-full" size="lg">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" className="w-full">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
