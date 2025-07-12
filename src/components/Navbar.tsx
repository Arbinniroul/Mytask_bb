"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/store/CartStore";
import { Github, LogOut, ShoppingCart, Store, User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
    const { itemCount } = useCart();
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <Store className="h-8 w-8 text-blue-600" />
                        <span className="text-xl font-bold text-gray-900">
                            ShopHub
                        </span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <Link href="/cart" className="relative">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="relative"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                                    >
                                        {itemCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        {user ? (
                            <div className="flex items-center space-x-2">
                                <Link href="/admin/dashboard">
                                    <Button variant="ghost" size="sm">
                                        <User className="h-4 w-4 mr-2" />
                                        Admin
                                    </Button>
                                </Link>
                                <Button
                                    onClick={logout}
                                    variant="ghost"
                                    size="sm"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <Link href="/admin/login">
                                <Button variant="outline" size="sm">
                                    <User className="h-4 w-4 mr-2" />
                                    Admin Login
                                </Button>
                            </Link>
                        )}

                        <Link
                            href="https://github.com/Arbinniroul/Mytask_bb"
                            className="relative cursor-pointer"
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                className="relativ cursor-pointer"
                            >
                                <Github className="size-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
