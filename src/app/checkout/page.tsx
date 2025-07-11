"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/store/CartStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const checkoutSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    address: z.string().min(10, "Please enter a complete address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
    });

    const onSubmit = async (data: CheckoutFormData) => {
        setIsSubmitting(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));

            clearCart();
            localStorage.setItem(
                "cart-storage",
                JSON.stringify({ ...data, items, total })
            );
            router.push("/success");
            toast.success("Order placed successfully!");
        } catch (error) {
            toast.error(`Failed to place order.${error} occured.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        router.push("/cart");
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Checkout Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Shipping Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    {...register("name")}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.name.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...register("email")}
                                    placeholder="Enter your email"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    {...register("phone")}
                                    placeholder="Enter your phone number"
                                />
                                {errors.phone && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.phone.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Textarea
                                    id="address"
                                    {...register("address")}
                                    placeholder="Enter your complete address"
                                    rows={3}
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-600 mt-1">
                                        {errors.address.message}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Placing Order..."
                                    : "Place Order"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.product.id}
                                className="flex justify-between"
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.product.title}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Qty: {item.quantity}
                                    </p>
                                </div>
                                <p className="font-bold">
                                    $
                                    {(
                                        item.product.price * item.quantity
                                    ).toFixed(2)}
                                </p>
                            </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>${(total * 0.1).toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span>${(total * 1.1).toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
