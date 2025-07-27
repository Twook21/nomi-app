"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, ShoppingCart, Package } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
    recentActiveOrder: {
        id: string;
        orderStatus: string;
        totalAmount: number;
    } | null;
    frequentlyPurchased: Product[];
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
        const response = await fetch('/api/profile/dashboard-summary', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Gagal memuat data dasbor.");
        const result = await response.json();
        setData(result.data);
    } catch (error) {
        toast.error("Gagal memuat data dasbor.", { description: error instanceof Error ? error.message : ""});
    } finally {
        setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--nimo-dark)]">Selamat Datang, {user?.username || 'Pengguna'}!</h1>
          <p className="text-muted-foreground mt-1">Senang melihatmu kembali. Mari selamatkan makanan hari ini.</p>
        </div>

        {isLoading ? (
            <Skeleton className="h-48 w-full rounded-lg" />
        ) : data?.recentActiveOrder ? (
            <Card className="bg-gradient-to-r from-nimo-yellow/80 to-nimo-yellow text-white">
                <CardHeader>
                    <CardTitle>Status Pesanan Terakhir</CardTitle>
                    <CardDescription className="text-white/80">Pesanan #{data.recentActiveOrder.id.substring(0,8)}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold capitalize">{data.recentActiveOrder.orderStatus}</p>
                    <p>Total: {formatRupiah(Number(data.recentActiveOrder.totalAmount))}</p>
                    <Button asChild variant="secondary" className="mt-4">
                        <Link href={`/profile/orders/${data.recentActiveOrder.id}`}>Lacak Pesanan</Link>
                    </Button>
                </CardContent>
            </Card>
        ) : (
            <Card>
                <CardHeader>
                    <CardTitle>Mulai Belanja</CardTitle>
                    <CardDescription>Anda tidak memiliki pesanan aktif saat ini. Jelajahi produk dan selamatkan makanan lezat!</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                        <Link href="/products">Lihat Semua Produk <ArrowRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                </CardContent>
            </Card>
        )}
        
        <div>
            <h2 className="text-2xl font-bold mb-4">Sering Anda Beli</h2>
            {isLoading ? (
                <div className="flex space-x-6 pb-4">
                    {Array.from({length: 4}).map((_, i) => <Skeleton key={i} className="w-64 h-80 rounded-lg" />)}
                </div>
            ) : data && data.frequentlyPurchased.length > 0 ? (
                <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 scrollbar-hide">
                    {data.frequentlyPurchased.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground">Anda belum pernah berbelanja. Mulai jelajahi produk sekarang!</p>
            )}
        </div>
      </div>
    </div>
  );
}