"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import type { UmkmOrder } from "@/types/umkm_order";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("id-ID", { dateStyle: 'long', timeStyle: 'short' });
}
const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    pending: "secondary", processing: "outline", shipped: "default", delivered: "default", cancelled: "destructive",
};
const orderStatuses: UmkmOrder['orderStatus'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function UmkmOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuthStore();
  const [order, setOrder] = useState<UmkmOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const orderId = params.id as string;

  const fetchOrder = useCallback(async () => {
    if (!token || !orderId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/orders/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal mengambil detail pesanan.");
      const result = await response.json();
      setOrder(result);
    } catch (error) {
      toast.error("Gagal memuat pesanan.", { description: error instanceof Error ? error.message : "Terjadi kesalahan." });
      router.back();
    } finally {
      setIsLoading(false);
    }
  }, [token, orderId, router]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  const handleStatusUpdate = async (newStatus: UmkmOrder['orderStatus']) => {
    toast.loading("Memperbarui status...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (!response.ok) throw new Error("Gagal memperbarui status.");
      toast.success("Status pesanan berhasil diperbarui!");
      fetchOrder(); // Muat ulang data untuk menampilkan status terbaru
    } catch (error) {
      toast.error("Gagal memperbarui status.", { description: error instanceof Error ? error.message : "Terjadi kesalahan." });
    }
  };

  if (isLoading) return <div className="p-8 text-center">Memuat detail pesanan...</div>;
  if (!order) return <div className="p-8 text-center">Pesanan tidak ditemukan.</div>;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pesanan #{order.id.substring(0, 8)}</CardTitle>
              <CardDescription>Dibuat pada {formatDate(order.createdAt)}</CardDescription>
            </div>
            <Badge variant={statusVariant[order.orderStatus]} className="capitalize text-sm">{order.orderStatus}</Badge>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <div className="space-y-4">
              {order.orderItems.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Image src={item.product.imageUrl || ''} alt={item.product.productName} width={64} height={64} className="rounded-md border object-cover"/>
                    <div>
                      <p className="font-medium">{item.product.productName}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity} x {formatRupiah(Number(item.pricePerItem))}</p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatRupiah(item.quantity * Number(item.pricePerItem))}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-1 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Detail Pelanggan</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p className="font-medium">{order.customer.username}</p>
            <p className="text-muted-foreground">{order.customer.email}</p>
            <p className="text-muted-foreground">{order.customer.phoneNumber}</p>
            <Separator className="my-4" />
            <h3 className="font-semibold">Alamat Pengiriman</h3>
            <p className="text-muted-foreground">{order.shippingAddress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Ubah Status</CardTitle></CardHeader>
          <CardContent>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span className="capitalize">{order.orderStatus}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {orderStatuses.map(status => (
                  <DropdownMenuItem key={status} onSelect={() => handleStatusUpdate(status)} className="capitalize">
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}