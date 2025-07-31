// File: src/app/umkm/products/page.tsx

"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trophy, Star } from "lucide-react";
import { DataTable } from "@/components/umkm/ProductDataTable";
import { getColumns } from "@/components/umkm/ProductTableColumns";
import Link from "next/link";
import type { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface ProductStats {
  bestSeller: { productName: string; totalSold: number | null } | null;
  highestRated: { productName: string; averageRating: number | null } | null;
}

function ProductStatsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 animate-pulse">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-full mb-1" />
          <Skeleton className="h-3 w-3/4" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-full mb-1" />
          <Skeleton className="h-3 w-3/4" />
        </CardContent>
      </Card>
    </div>
  );
}

function ProductTableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-10 w-32" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-80 w-full" />
      </CardContent>
    </Card>
  );
}

export default function UmkmProductsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
  const { token, logout } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !user || user.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      let headers: HeadersInit = {};
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const [listRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/products`, {
          headers,
          credentials: authMethod === 'nextauth' ? 'include' : 'omit'
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/product-stats`, {
          headers,
          credentials: authMethod === 'nextauth' ? 'include' : 'omit'
        })
      ]);

      if (!listRes.ok || !statsRes.ok) {
        if (listRes.status === 401 || listRes.status === 403 || statsRes.status === 401 || statsRes.status === 403) {
          toast.error("Akses ditolak.", { description: "Anda tidak memiliki izin untuk melihat produk UMKM atau sesi Anda berakhir." });
          logout();
          router.push('/auth/login');
          return;
        }
        throw new Error("Gagal mengambil data produk.");
      }

      const listData = await listRes.json();
      setProducts(listData.products || []);
      setStats(await statsRes.json());
    } catch (error) {
      toast.error("Gagal memuat data", { description: error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga." });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, authMethod, token, logout, router]);

  useEffect(() => {
    if (!authLoading) {
        if (!isAuthenticated) {
            router.replace('/auth/login');
        } else if (user?.role !== 'umkm_owner') {
            toast.info("Anda tidak memiliki akses ke halaman produk UMKM.", { description: "Anda akan diarahkan ke dasbor pelanggan." });
            router.replace('/profile');
        } else if (user.umkmProfileStatus !== 'verified') {
            toast.info("Profil UMKM Anda belum diverifikasi.", { description: "Mohon tunggu persetujuan admin untuk mengakses fitur ini." });
            router.replace('/profile/pending-verification');
        }
        else {
            fetchData();
        }
    }
  }, [authLoading, isAuthenticated, user, router, fetchData]);

  // PERBAIKAN: Bungkus handleSuccess dengan useCallback
  const handleSuccess = useCallback(() => {
    fetchData();
  }, [fetchData]); // Pastikan fetchData adalah dependensi

  const columns = getColumns(handleSuccess); // Ini sekarang seharusnya tidak error

  if (authLoading || isLoading) {
    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6"><Skeleton className="h-8 w-1/3" /></h1>
            <ProductStatsSkeleton />
            <ProductTableSkeleton />
        </div>
    );
  }

  if (!isAuthenticated) {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center">
                <p className="text-muted-foreground">Silakan login untuk mengakses halaman produk UMKM Anda.</p>
                <Button asChild className="mt-4 bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                    <Link href="/auth/login">Login</Link>
                </Button>
            </div>
        </div>
    );
  }

  if (user?.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified') {
      return (
          <div className="container mx-auto py-8 px-4">
              <div className="text-center">
                  <p className="text-muted-foreground">Anda tidak memiliki izin untuk melihat halaman produk UMKM atau profil Anda belum diverifikasi.</p>
                  <Button asChild className="mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300">
                      <Link href={user?.umkmProfileStatus === 'pending' ? '/profile/pending-verification' : '/profile'}>
                          {user?.umkmProfileStatus === 'pending' ? 'Lihat Status Verifikasi' : 'Kembali ke Dasbor Pelanggan'}
                      </Link>
                  </Button>
                  {user?.role === 'customer' && !user.umkmProfileStatus && (
                      <Button asChild className="mt-2 bg-nimo-yellow text-white hover:bg-nimo-yellow/90 ml-2">
                          <Link href="/profile/become-partner">Daftar sebagai Mitra UMKM</Link>
                      </Button>
                  )}
              </div>
          </div>
      );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Produk UMKM Saya</h1>
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
      <Card className="mt-6">
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