/*
================================================================================
File: src/app/profile/orders/page.tsx (FIXED)
Description: Halaman riwayat pesanan dengan perbaikan pada cara membaca data API.
================================================================================
*/
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import type { Order } from "@/types/order";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

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

export default function OrderHistoryPage() {
  const router = useRouter();
  const { token, logout } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.status === 401) {
          toast.error("Sesi Anda berakhir.");
          logout();
          router.push('/auth/login');
          return;
        }

        if (!response.ok) throw new Error("Gagal mengambil riwayat pesanan.");
        
        const result = await response.json();
        // PERBAIKAN: Langsung gunakan 'result' karena API mengirim array secara langsung
        setOrders(result || []);
      } catch (error) {
        toast.error("Terjadi Kesalahan", {
          description: error instanceof Error ? error.message : "Tidak dapat terhubung ke server.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token, router, logout]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-5 w-1/4" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>
      {orders.length > 0 ? (
        orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle>Pesanan #{order.id.substring(0, 8)}</CardTitle>
                <CardDescription>Dibuat pada: {formatDate(order.createdAt)}</CardDescription>
              </div>
              <Badge variant={statusVariant[order.orderStatus] || 'default'} className="capitalize">
                {order.orderStatus}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">Total: {formatRupiah(order.totalAmount)}</p>
            </CardContent>
            <CardFooter>
                <Button asChild>
                    <Link href={`/profile/orders/${order.id}`}>Lihat Detail</Link>
                </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p>Anda belum memiliki riwayat pesanan.</p>
      )}
    </div>
  );
}
