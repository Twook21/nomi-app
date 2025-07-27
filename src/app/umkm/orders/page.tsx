"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import type { UmkmOrder } from "@/types/umkm_order";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/umkm/ProductDataTable"; // Kita bisa gunakan ulang komponen ini
import { getOrderColumns } from "@/components/umkm/OrderTableColumns"; // Kolom baru untuk pesanan

export default function UmkmOrdersPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<UmkmOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/orders`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal mengambil data pesanan.");
      
      const result = await response.json();
      // API mengirim data dalam 'result.orders'
      setOrders(result.orders || []);
    } catch (error) {
      toast.error("Gagal memuat pesanan", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan server."
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const columns = getOrderColumns();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Pesanan Masuk</h1>
          <p className="text-muted-foreground">Kelola semua pesanan yang masuk untuk produk Anda.</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="text-center p-8 text-muted-foreground">Memuat data pesanan...</div>
          ) : (
            <DataTable columns={columns} data={orders} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
