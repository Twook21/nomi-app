// File: src/app/profile/orders/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import type { Order, Review } from "@/types/order"; // Pastikan Order dan Review sudah memiliki semua field yang diperlukan
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { ReviewDialog } from "@/components/profile/ReviewDialog";
import { FileText, ShoppingCart, Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";

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
        day: 'numeric'
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

// Interface untuk state dialog review
interface ReviewDialogState {
    productId: string;
    productName: string;
    initialData?: {
        rating: number;
        comment?: string | null;
    }
}

export default function OrderHistoryPage() {
    const router = useRouter();
    // Gunakan useAuth hook untuk status otentikasi terpadu
    const { isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
    const { token, logout } = useAuthStore(); // Masih butuh token untuk JWT method jika belum diuseAuth

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reviewDialogState, setReviewDialogState] = useState<ReviewDialogState | null>(null);

    const fetchOrders = useCallback(async () => {
        // Cek autentikasi dari useAuth hook
        if (!isAuthenticated) {
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

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, {
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
                throw new Error("Gagal mengambil riwayat pesanan.");
            }
            const result = await response.json();
            setOrders(result || []);
        } catch (error) {
            toast.error("Gagal memuat pesanan", { description: error instanceof Error ? error.message : "" });
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, authMethod, token, router, logout]); // Tambahkan semua dependencies

    useEffect(() => {
        // Panggil fetchOrders hanya jika isAuthenticated sudah diketahui dan true
        if (!authLoading) { // Pastikan status autentikasi sudah selesai dimuat
            if (!isAuthenticated) {
                router.replace('/auth/login');
            } else {
                fetchOrders();
            }
        }
    }, [authLoading, isAuthenticated, router, fetchOrders]);


    const activeOrders = orders.filter(o => o.orderStatus !== 'delivered' && o.orderStatus !== 'cancelled');
    const completedOrders = orders.filter(o => o.orderStatus === 'delivered' || o.orderStatus === 'cancelled');

    // Tampilkan loading state jika authLoading atau data sedang dimuat
    if (authLoading || isLoading) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-10 w-52 rounded-md" />
                    </div>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                    <Skeleton className="h-6 w-20 rounded-full" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-16 w-16 rounded-lg" />
                                    <div className="space-y-2 flex-grow">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Tampilkan pesan jika tidak terautentikasi (setelah loading selesai)
    if (!isAuthenticated) {
        return (
            <div className="container mx-auto py-8 px-4">
                <div className="text-center">
                    <p className="text-muted-foreground">Silakan login untuk melihat riwayat pesanan Anda.</p>
                    <Button asChild className="mt-4 bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                        <Link href="/auth/login">Login</Link>
                    </Button>
                </div>
            </div>
        );
    }


    return (
        <>
            <ReviewDialog
                isOpen={!!reviewDialogState}
                onOpenChange={() => setReviewDialogState(null)}
                productId={reviewDialogState?.productId || ''}
                productName={reviewDialogState?.productName || ''}
                initialData={reviewDialogState?.initialData}
                onSuccess={fetchOrders}
            />
            <div className="container mx-auto py-8 px-4"> {/* Tambahkan container */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h1 className="text-2xl font-bold tracking-tight">Riwayat Pesanan</h1>
                        <p className="text-sm text-muted-foreground">
                            Total {orders.length} transaksi ditemukan.
                        </p>
                    </div>

                    <Tabs defaultValue="active" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="active">
                                <ShoppingCart className="w-4 h-4 mr-2" /> Pesanan Aktif
                            </TabsTrigger>
                            <TabsTrigger value="completed">
                                <FileText className="w-4 h-4 mr-2" /> Pesanan Selesai
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="active" className="space-y-4 mt-6">
                            {activeOrders.length > 0 ? activeOrders.map((order) => (
                                <Card key={order.id} className="transition-all hover:shadow-lg hover:border-primary/20">
                                    <CardHeader>
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <CardTitle className="text-base font-semibold">Pesanan #{order.id.substring(0, 8)}</CardTitle>
                                                <CardDescription>{formatDate(order.createdAt)}</CardDescription>
                                            </div>
                                            <Badge variant={statusVariant[order.orderStatus] || 'default'} className="capitalize shrink-0">
                                                {order.orderStatus}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground mb-2">{order.orderItems.length} jenis barang</p>
                                        <p className="text-xl font-bold">Total: {formatRupiah(order.totalAmount)}</p>
                                    </CardContent>
                                    <CardFooter className="bg-muted/50 p-4">
                                        <Button asChild className="w-full">
                                            <Link href={`/profile/orders/${order.id}`}>Lihat Detail Pesanan</Link>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            )) : (
                                <div className="text-center py-16 px-6 border-2 border-dashed rounded-lg">
                                    <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-lg font-medium">Anda belum memiliki pesanan aktif</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Mari mulai berbelanja dan pesanan Anda akan muncul di sini.
                                    </p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="completed" className="space-y-4 mt-6">
                            {completedOrders.length > 0 ? completedOrders.map((order) => (
                                <Card key={order.id} className="overflow-hidden">
                                    <CardHeader>
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <CardTitle className="text-base font-semibold">Pesanan #{order.id.substring(0, 8)}</CardTitle>
                                                <CardDescription>{formatDate(order.createdAt)}</CardDescription>
                                            </div>
                                            <Badge variant={statusVariant[order.orderStatus] || 'default'} className="capitalize shrink-0">
                                                {order.orderStatus}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        <div className="bg-muted/50 p-4 space-y-4">
                                            {order.orderItems.map(item => {
                                                const userReview = item.product.reviews?.[0];

                                                return (
                                                    <div key={item.id} className="flex justify-between items-center gap-4">
                                                        <div className="flex items-center gap-3">
                                                            <Image src={item.product.imageUrl || 'https://placehold.co/64'} alt={item.product.productName} width={48} height={48} className="rounded-md border" />
                                                            <div>
                                                                <p className="font-semibold text-sm leading-tight">{item.product.productName}</p>
                                                                <p className="text-xs text-muted-foreground">{item.quantity} barang</p>

                                                                {userReview && (
                                                                    <div className="flex items-center gap-1 mt-1">
                                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                                        <span className="text-sm font-bold">{userReview.rating}</span>
                                                                        <span className="text-xs text-muted-foreground truncate"> - "{userReview.comment || 'Tanpa komentar'}"</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {order.orderStatus === 'delivered' && (
                                                            <Button
                                                                variant={userReview ? "secondary" : "outline"}
                                                                size="sm"
                                                                onClick={() => setReviewDialogState({
                                                                    productId: item.product.id,
                                                                    productName: item.product.productName,
                                                                    initialData: userReview ? { rating: userReview.rating, comment: userReview.comment } : undefined
                                                                })}
                                                            >
                                                                {userReview ? "Edit Ulasan" : "Ulas"}
                                                            </Button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <Separator />
                                        <div className="p-4 flex justify-between items-center">
                                            <span className="text-sm font-medium">Total Pesanan</span>
                                            <span className="text-lg font-bold">{formatRupiah(order.totalAmount)}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            )) : (
                                <div className="text-center py-16 px-6 border-2 border-dashed rounded-lg">
                                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-lg font-medium">Tidak ada riwayat pesanan</h3>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Pesanan yang sudah selesai atau dibatalkan akan tampil di sini.
                                    </p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    );
}