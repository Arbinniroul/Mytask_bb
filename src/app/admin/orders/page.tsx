"use client";

import { useEffect, useState } from "react";

import AdminRoute from "@/components/AdminRoute";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { fetchOrders } from "@/lib/api";
import { Order } from "@/types";
import {
    CheckCircle,
    Eye,
    Filter,
    Package,
    Search,
    ShoppingCart,
    Truck,
} from "lucide-react";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        async function loadOrders() {
            setLoading(true);
            const data = await fetchOrders();
            setOrders(data);
            setFilteredOrders(data);
            setLoading(false);
        }
        loadOrders();
    }, []);

    useEffect(() => {
        let filtered = orders;

        if (searchTerm) {
            filtered = filtered.filter(
                (order) =>
                    order.customer.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    order.customer.email
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    order.id.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedStatus !== "all") {
            filtered = filtered.filter(
                (order) => order.status === selectedStatus
            );
        }

        setFilteredOrders(filtered);
    }, [orders, searchTerm, selectedStatus]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Package className="h-4 w-4" />;
            case "processing":
                return <Truck className="h-4 w-4" />;
            case "shipped":
                return <Truck className="h-4 w-4" />;
            case "delivered":
                return <CheckCircle className="h-4 w-4" />;
            default:
                return <Package className="h-4 w-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "secondary";
            case "processing":
                return "default";
            case "shipped":
                return "outline";
            case "delivered":
                return "default";
            default:
                return "secondary";
        }
    };

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    return (
        <AdminRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600 mt-2">
                        Manage customer orders and track deliveries
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Pending
                            </CardTitle>
                            <Package className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    orders.filter((o) => o.status === "pending")
                                        .length
                                }
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Shipped
                            </CardTitle>
                            <Truck className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {
                                    orders.filter((o) => o.status === "shipped")
                                        .length
                                }
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Revenue
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${totalRevenue.toFixed(2)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Filter Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                            <Select
                                value={selectedStatus}
                                onValueChange={setSelectedStatus}
                            >
                                <SelectTrigger className="w-full md:w-48">
                                    <Filter className="h-4 w-4 mr-2" />
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Status
                                    </SelectItem>
                                    <SelectItem value="pending">
                                        Pending
                                    </SelectItem>
                                    <SelectItem value="processing">
                                        Processing
                                    </SelectItem>
                                    <SelectItem value="shipped">
                                        Shipped
                                    </SelectItem>
                                    <SelectItem value="delivered">
                                        Delivered
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Orders Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="animate-pulse flex space-x-4"
                                    >
                                        <div className="flex-1 space-y-2 py-1">
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-sm">
                                                {order.id.slice(-8)}
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {order.customer.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {order.customer.email}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="font-medium">
                                                    {order.items.length}
                                                </span>
                                                <span className="text-sm text-gray-600 ml-1">
                                                    item
                                                    {order.items.length > 1
                                                        ? "s"
                                                        : ""}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                ${order.total.toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        getStatusColor(
                                                            order.status
                                                        ) as any
                                                    }
                                                >
                                                    {getStatusIcon(
                                                        order.status
                                                    )}
                                                    <span className="ml-1 capitalize">
                                                        {order.status}
                                                    </span>
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    order.createdAt
                                                ).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                setSelectedOrder(
                                                                    order
                                                                )
                                                            }
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>
                                                                Order Details
                                                            </DialogTitle>
                                                        </DialogHeader>
                                                        {selectedOrder && (
                                                            <div className="space-y-6">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <h4 className="font-medium text-sm text-gray-500">
                                                                            Order
                                                                            ID
                                                                        </h4>
                                                                        <p className="font-mono">
                                                                            {
                                                                                selectedOrder.id
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium text-sm text-gray-500">
                                                                            Status
                                                                        </h4>
                                                                        <Badge
                                                                            variant={
                                                                                getStatusColor(
                                                                                    selectedOrder.status
                                                                                ) as any
                                                                            }
                                                                        >
                                                                            {getStatusIcon(
                                                                                selectedOrder.status
                                                                            )}
                                                                            <span className="ml-1 capitalize">
                                                                                {
                                                                                    selectedOrder.status
                                                                                }
                                                                            </span>
                                                                        </Badge>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium text-sm text-gray-500">
                                                                            Order
                                                                            Date
                                                                        </h4>
                                                                        <p>
                                                                            {new Date(
                                                                                selectedOrder.createdAt
                                                                            ).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    <div>
                                                                        <h4 className="font-medium text-sm text-gray-500">
                                                                            Total
                                                                        </h4>
                                                                        <p className="font-bold text-lg">
                                                                            $
                                                                            {selectedOrder.total.toFixed(
                                                                                2
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <h4 className="font-medium text-sm text-gray-500 mb-2">
                                                                        Customer
                                                                        Information
                                                                    </h4>
                                                                    <div className="p-4 bg-gray-50 rounded-lg">
                                                                        <p className="font-medium">
                                                                            {
                                                                                selectedOrder
                                                                                    .customer
                                                                                    .name
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-gray-600">
                                                                            {
                                                                                selectedOrder
                                                                                    .customer
                                                                                    .email
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-gray-600 mt-1">
                                                                            {
                                                                                selectedOrder
                                                                                    .customer
                                                                                    .address
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <h4 className="font-medium text-sm text-gray-500 mb-2">
                                                                        Order
                                                                        Items
                                                                    </h4>
                                                                    <div className="space-y-2">
                                                                        {selectedOrder.items.map(
                                                                            (
                                                                                item,
                                                                                index
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                                                                >
                                                                                    <div>
                                                                                        <p className="font-medium">
                                                                                            {
                                                                                                item
                                                                                                    .product
                                                                                                    .title
                                                                                            }
                                                                                        </p>
                                                                                        <p className="text-sm text-gray-600">
                                                                                            Quantity:{" "}
                                                                                            {
                                                                                                item.quantity
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                    <p className="font-bold">
                                                                                        $
                                                                                        {(
                                                                                            item
                                                                                                .product
                                                                                                .price *
                                                                                            item.quantity
                                                                                        ).toFixed(
                                                                                            2
                                                                                        )}
                                                                                    </p>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </DialogContent>
                                                </Dialog>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {!loading && filteredOrders.length === 0 && (
                            <div className="text-center py-8">
                                <p className="text-gray-500">
                                    No orders found matching your criteria.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminRoute>
    );
}
