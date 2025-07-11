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
            try {
                const [productsData, ordersData] = await Promise.all([
                    fetchProducts(),
                    fetchOrders(),
                ]);

                setProducts(productsData);
                setOrders(ordersData);
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    const lowStockProducts = products.filter((p) => p.stock <= 5);
    const recentOrders = [...orders]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    if (loading) {
        return (
            <AdminRoute>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-32 bg-gray-200 rounded"
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>
            </AdminRoute>
        );
    }

    return (
        <AdminRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Welcome back! Here's what's happening with your store.
                    </p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Products
                            </CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {products.length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {lowStockProducts.length} low stock items
                            </p>
                        </CardContent>
                    </Card>

                    <Link href={"/admin/orders"}>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Orders
                                </CardTitle>
                                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {orders.length}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {
                                        orders.filter(
                                            (o) => o.status === "pending"
                                        ).length
                                    }{" "}
                                    pending
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Orders</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {order.customer.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {order.customer.email}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">
                                                ${order.total.toFixed(2)}
                                            </p>
                                            <Badge
                                                variant={
                                                    order.status === "pending"
                                                        ? "secondary"
                                                        : "default"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {recentOrders.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">
                                        No orders yet
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Low Stock Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Low Stock Alert</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {lowStockProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="flex items-center justify-between p-4 border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {product.title}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {product.category}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold">
                                                ${product.price}
                                            </p>
                                            <Badge variant="destructive">
                                                {product.stock} left
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {lowStockProducts.length === 0 && (
                                    <p className="text-gray-500 text-center py-4">
                                        All products are well stocked
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminRoute>
    );
}
