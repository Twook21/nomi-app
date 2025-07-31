"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Star,
  Trophy, // Ini tidak digunakan
  TrendingUp, // Ini tidak digunakan
} from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // <--- TAMBAHKAN INI

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function DashboardSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6 animate-pulse">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-96 w-full" />
          <div className="col-span-3 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UmkmDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
  const { token, logout } = useAuthStore();

  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !user || user.role !== 'umkm_owner') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      let headers: HeadersInit = {};
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch("/api/umkm-owners/me/dashboard-summary", {
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error("Akses ditolak.", { description: "Anda tidak memiliki izin untuk melihat dasbor UMKM atau sesi Anda berakhir." });
          logout();
          router.push('/auth/login');
          return;
        }
        throw new Error((await response.json()).message || "Gagal memuat data dasbor.");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      toast.error("Gagal memuat dasbor", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, authMethod, token, logout, router]);

  useEffect(() => {
    if (!authLoading) {
        if (!isAuthenticated) {
            router.replace('/auth/login');
        } else if (user?.role !== 'umkm_owner') {
            toast.info("Anda tidak memiliki akses ke dasbor UMKM.", { description: "Anda akan diarahkan ke dasbor pelanggan." });
            router.replace('/profile');
        } else {
            fetchData();
        }
    }
  }, [authLoading, isAuthenticated, user, router, fetchData]);

  if (authLoading || isLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center">
                <p className="text-muted-foreground">Silakan login untuk mengakses dasbor UMKM Anda.</p>
                <Button asChild className="mt-4 bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                    <Link href="/auth/login">Login</Link>
                </Button>
            </div>
        </div>
    );
  }

  if (user?.role !== 'umkm_owner') {
      return (
          <div className="container mx-auto py-8 px-4">
              <div className="text-center">
                  <p className="text-muted-foreground">Anda tidak memiliki izin untuk melihat dasbor UMKM.</p>
                  <Button asChild className="mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300">
                      <Link href="/profile">Kembali ke Dasbor Pelanggan</Link>
                  </Button>
              </div>
          </div>
      );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dasbor Penjual</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Omset Bulan Ini
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatRupiah(Number(data?.stats.currentMonthRevenue || 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                Pendapatan bulan ini
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.stats.totalOrders || 0}</div>
              <p className="text-xs text-muted-foreground">Dari semua waktu</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produk Aktif</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data?.stats.activeProducts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Produk yang sedang dijual
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rating Tertinggi
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold truncate">
                {data?.highestRated?.productName || "-"}
              </div>
              <p className="text-xs text-muted-foreground">
                {data?.highestRated
                  ? `Avg. ${data.highestRated.averageRating.toFixed(1)} ★`
                  : "Belum ada rating"}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Analisa Omset (6 Bulan Terakhir)</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={data?.monthlyTurnover || []}>
                  <XAxis dataKey="month" stroke="#888888" fontSize={12} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickFormatter={(value) => `Rp${Number(value) / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--background))" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="omset"
                    stroke="var(--nimo-yellow)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className="col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pesanan Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.recentOrders?.length > 0 ? (
                  <ul className="space-y-3">
                    {data.recentOrders.map((o: any) => (
                      <li key={o.id} className="flex justify-between text-sm">
                        <span>{o.customer?.username || 'Pengguna'}</span>
                        <span className="font-medium">
                          {formatRupiah(Number(o.totalAmount))}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Belum ada pesanan.
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Produk Terlaris</CardTitle>
              </CardHeader>
              <CardContent>
                {data?.bestSellers?.length > 0 ? (
                  <ul className="space-y-3">
                    {data.bestSellers.map((p: any) => (
                      <li key={p.id} className="flex justify-between text-sm">
                        <span className="truncate pr-2">{p.productName}</span>
                        <span className="font-medium">{p.totalSold} terjual</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Belum ada data penjualan.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}