"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
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
  Trophy,
  TrendingUp,
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

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function DashboardSkeleton() {
  return (
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
  );
}

export default function UmkmDashboardPage() {
  const { user, token } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch("/api/umkm-owners/me/dashboard-summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal memuat data dasbor.");
      const result = await response.json();
      setData(result);
    } catch (error) {
      toast.error("Gagal memuat dasbor", {
        description: error instanceof Error ? error.message : "",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
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
              {formatRupiah(Number(data?.stats.currentMonthRevenue))}
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
            <div className="text-2xl font-bold">{data?.stats.totalOrders}</div>
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
              {data?.stats.activeProducts}
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
              <LineChart data={data?.monthlyTurnover}>
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
              {data?.recentOrders.length > 0 ? (
                <ul className="space-y-3">
                  {data.recentOrders.map((o: any) => (
                    <li key={o.id} className="flex justify-between text-sm">
                      <span>{o.customer.username}</span>
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
              {data?.bestSellers.length > 0 ? (
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
  );
}
