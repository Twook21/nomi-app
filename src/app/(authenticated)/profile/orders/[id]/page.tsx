"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import type { Order } from "@/types/order";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
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
  const { token, logout } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const orderId = params.id as string;

  useEffect(() => {
    if (!token || !orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (response.status === 401) {
          toast.error("Sesi Anda berakhir.");
          logout();
          router.push('/auth/login');
          return;
        }

        if (!response.ok) throw new Error("Gagal mengambil detail pesanan.");
        
        const result = await response.json();
        setOrder(result);
      } catch (error) {
        toast.error("Gagal Memuat Pesanan", {
          description: error instanceof Error ? error.message : "Pesanan tidak ditemukan atau terjadi kesalahan.",
        });
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [token, orderId, router, logout]);

  if (isLoading) {
    return <div>Memuat detail pesanan...</div>;
  }

  if (!order) {
    return <div>Pesanan tidak ditemukan.</div>;
  }

  return (
    <div>
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
                    <Image src={item.product.imageUrl} alt={item.product.productName} width={64} height={64} className="rounded-md border object-cover"/>
                    <div>
                      <Link href={`/products/${item.product.id}`} className="font-medium hover:underline">{item.product.productName}</Link>
                      <p className="text-sm text-muted-foreground">
                        {/* PERBAIKAN: Menggunakan item.pricePerItem */}
                        {item.quantity} x {formatRupiah(Number(item.pricePerItem))}
                      </p>
                    </div>
                  </div>
                  {/* PERBAIKAN: Menggunakan item.pricePerItem */}
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
                <span>Rp 0</span>
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
