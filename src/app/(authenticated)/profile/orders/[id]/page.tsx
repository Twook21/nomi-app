// File: src/app/profile/orders/[id]/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react"; // Tambahkan useCallback
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import type { Order } from "@/types/order";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"; // Import Button for login

// Fungsi untuk format mata uang Rupiah
function formatRupiah(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
}

// Fungsi untuk format tanggal
function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("id-ID", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Mapping status ke warna badge
const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    pending: "secondary",
    processing: "outline",
    shipped: "default",
    delivered: "default",
    cancelled: "destructive",
};

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    // Gunakan useAuth hook untuk status otentikasi terpadu
    const { isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
    const { token, logout } = useAuthStore(); // Masih butuh token untuk JWT method jika belum diuseAuth

    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const orderId = params.id as string;

    const fetchOrder = useCallback(async () => {
        // Cek autentikasi dari useAuth hook
        if (!isAuthenticated || !orderId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            let headers: HeadersInit = {};
            // Set header Authorization untuk JWT
            if (authMethod === 'jwt' && token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            // Untuk NextAuth, `credentials: 'include'` akan otomatis mengirim cookie

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`, {
                headers,
                credentials: authMethod === 'nextauth' ? 'include' : 'omit', // Penting untuk NextAuth
            });

            if (!response.ok) {
                // NextAuth handles 401 via session provider, but a manual fetch might still need this.
                // However, useSession's status should catch it.
                if (response.status === 401) {
                    toast.error("Sesi Anda berakhir.");
                    logout(); // Trigger manual logout for Zustand store and redirects
                    router.push('/auth/login');
                    return;
                }
                throw new Error("Gagal mengambil detail pesanan.");
            }

            const result = await response.json();
            setOrder(result);
        } catch (error) {
            toast.error("Gagal Memuat Pesanan", {
                description: error instanceof Error ? error.message : "Pesanan tidak ditemukan atau terjadi kesalahan.",
            });
            router.back(); // Kembali ke halaman sebelumnya jika gagal
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, authMethod, token, orderId, router, logout]); // Tambahkan semua dependencies

    useEffect(() => {
        // Panggil fetchOrder hanya jika isAuthenticated sudah diketahui dan true
        if (!authLoading && orderId) { // Pastikan status autentikasi sudah selesai dimuat dan orderId ada
            if (!isAuthenticated) {
                router.replace('/auth/login');
            } else {
                fetchOrder();
            }
        }
    }, [authLoading, isAuthenticated, orderId, router, fetchOrder]);


    // Tampilkan loading state jika authLoading atau data sedang dimuat
    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <Skeleton className="h-8 w-64 mb-4" />
                <Skeleton className="h-48 w-full rounded-lg" />
            </div>
        );
    }

    // Tampilkan pesan jika tidak terautentikasi (setelah loading selesai)
    if (!isAuthenticated) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center">
                    <p className="text-muted-foreground">Silakan login untuk melihat detail pesanan Anda.</p>
                    <Button asChild className="mt-4 bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                        <Link href="/auth/login">Login</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Tampilkan pesan jika pesanan tidak ditemukan (setelah loading selesai dan isAuthenticated)
    if (!order) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center">
                    <p className="text-muted-foreground">Pesanan tidak ditemukan atau Anda tidak memiliki akses.</p>
                    <Button asChild className="mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300">
                        <Link href="/profile/orders">Kembali ke Riwayat Pesanan</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4"> {/* Tambahkan container */}
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Detail Pesanan #{order.id.substring(0, 8)}</h1>
                <Badge variant={statusVariant[order.orderStatus] || 'default'} className="capitalize text-base">
                    {order.orderStatus}
                </Badge>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Informasi Pesanan</CardTitle>
                    <CardDescription>Dibuat pada {formatDate(order.createdAt)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Alamat Pengiriman</h3>
                        <p className="text-muted-foreground">{order.shippingAddress}</p>
                    </div>
                    <Separator />
                    <div>
                        <h3 className="font-semibold mb-4">Barang Pesanan</h3>
                        <div className="space-y-4">
                            {order.orderItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {/* Tambahkan fallback untuk imageUrl */}
                                        <Image src={item.product.imageUrl || 'https://placehold.co/64'} alt={item.product.productName} width={64} height={64} className="rounded-md border object-cover" />
                                        <div>
                                            <Link href={`/products/${item.product.id}`} className="font-medium hover:underline">{item.product.productName}</Link>
                                            <p className="text-sm text-muted-foreground">
                                                {item.quantity} x {formatRupiah(Number(item.pricePerItem))}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-semibold">{formatRupiah(item.quantity * Number(item.pricePerItem))}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>{formatRupiah(order.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Pengiriman</span>
                            <span>Rp 0</span> {/* Asumsi biaya pengiriman 0 */}
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>{formatRupiah(order.totalAmount)}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}