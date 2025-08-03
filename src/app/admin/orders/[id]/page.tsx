"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface OrderDetail {
  id: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
  shippingAddress: string;
  customer: { username: string; email: string; phoneNumber: string | null };
  umkmOwner: { umkmName: string; umkmEmail: string | null; umkmPhoneNumber: string | null };
  orderItems: { id: string; quantity: number; pricePerItem: number; product: { id: string; productName: string; imageUrl: string | null } }[];
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("id-ID", { dateStyle: 'long', timeStyle: 'short' });
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const { token } = useAuthStore();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const orderId = params.id as string;

  useEffect(() => {
    if (!token || !orderId) return;
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Gagal mengambil detail pesanan.");
        const result = await response.json();
        setOrder(result);
      } catch (error) {
        toast.error("Gagal memuat pesanan.", { description: error instanceof Error ? error.message : "Terjadi kesalahan." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [token, orderId]);

  if (isLoading) return <div className="p-8 text-center">Memuat detail pesanan...</div>;
  if (!order) return <div className="p-8 text-center">Pesanan tidak ditemukan.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Detail Pesanan #{order.id.substring(0, 8)}</h1>
        <p className="text-muted-foreground">Dibuat pada {formatDate(order.createdAt)}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader><CardTitle>Barang Pesanan</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {order.orderItems.map(item => (
                <li key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image src={item.product.imageUrl || ''} alt={item.product.productName} width={64} height={64} className="rounded-md border object-cover"/>
                    <div>
                      <p className="font-medium">{item.product.productName}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity} x {formatRupiah(Number(item.pricePerItem))}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatRupiah(item.quantity * Number(item.pricePerItem))}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Informasi Pelanggan</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-medium">{order.customer.username}</p>
              <p className="text-muted-foreground">{order.customer.email}</p>
              <p className="text-muted-foreground">{order.customer.phoneNumber || 'No phone'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Informasi Mitra UMKM</CardTitle></CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-medium">{order.umkmOwner.umkmName}</p>
              <p className="text-muted-foreground">{order.umkmOwner.umkmEmail || 'No email'}</p>
              <p className="text-muted-foreground">{order.umkmOwner.umkmPhoneNumber || 'No phone'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}