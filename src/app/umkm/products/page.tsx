"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trophy, Star } from "lucide-react";
import { DataTable } from "@/components/umkm/ProductDataTable";
import { getColumns } from "@/components/umkm/ProductTableColumns";
import Link from "next/link";
import type { Product } from "@/types/product";

interface ProductStats {
  bestSeller: { productName: string; totalSold: number | null } | null;
  highestRated: { productName: string; averageRating: number | null } | null;
}

export default function UmkmProductsPage() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/products`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/product-stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (!listRes.ok || !statsRes.ok) throw new Error("Gagal mengambil data produk.");
      
      const listData = await listRes.json();
      setProducts(listData.products || []);
      setStats(await statsRes.json());
    } catch (error) {
      toast.error("Gagal memuat data", { description: error instanceof Error ? error.message : "" });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSuccess = () => {
    fetchData();
  };

  const columns = getColumns(handleSuccess);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk Terlaris</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{stats?.bestSeller?.productName || '-'}</div>
            <p className="text-xs text-muted-foreground">{stats?.bestSeller ? `${stats.bestSeller.totalSold} unit terjual` : 'Belum ada penjualan'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating Tertinggi</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">{stats?.highestRated?.productName || '-'}</div>
            <p className="text-xs text-muted-foreground">{stats?.highestRated ? `Rata-rata ${stats.highestRated.averageRating?.toFixed(1)} ★` : 'Belum ada ulasan'}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daftar Produk Saya</CardTitle>
            <Button asChild className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
              <Link href="/umkm/products/new"><PlusCircle className="mr-2 h-4 w-4" />Tambah Produk</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-8 text-muted-foreground">Memuat data produk...</div>
          ) : (
            <DataTable columns={columns} data={products} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}