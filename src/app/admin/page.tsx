"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Package,
  ShoppingCart,
  Store,
  ArrowRight,
  Building,
  Star,
  LucideIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// --- INTERFACES ---
interface Stats {
  totalUsers: number;
  totalUmkm: number;
  totalProducts: number;
  totalOrders: number;
}
interface PendingUmkm {
  id: string;
  umkmName: string;
  user: { email: string };
}
interface RecentOrder {
  id: string;
  totalAmount: number;
  customer: { username: string };
}
interface SalesData {
  name: string;
  total: number;
}
interface TopProduct {
  id: string;
  productName: string;
  averageRating: number;
  umkmOwner: { umkmName: string };
}

// --- KOMPONEN REUSABLE ---
interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  href: string;
  isLoading: boolean;
}

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  isLoading,
}: StatCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:bg-accent transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-8 w-1/2" />
          ) : (
            <div className="text-2xl font-bold">{value}</div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

// --- KOMPONEN UTAMA ---
export default function AdminDashboardPage() {
  const { token } = useAuthStore();
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingUmkms, setPendingUmkms] = useState<PendingUmkm[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [dashboardRes, salesRes, topProductsRes] = await Promise.all([
        fetch("/api/admin/dashboard-summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/sales-data", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/top-products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!dashboardRes.ok || !salesRes.ok || !topProductsRes.ok)
        throw new Error("Gagal memuat semua data dasbor.");

      const dashboardData = await dashboardRes.json();
      setStats(dashboardData.stats);
      setPendingUmkms(dashboardData.pendingUmkms);
      setRecentOrders(dashboardData.recentOrders);
      setSalesData(await salesRes.json());
      setTopProducts(await topProductsRes.json());
    } catch (error) {
      toast.error("Gagal memuat data dasbor.", {
        description:
          error instanceof Error ? error.message : "Coba lagi nanti.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatRupiah = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dasbor Admin</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Pengguna"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          href="/admin/users"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Mitra UMKM"
          value={stats?.totalUmkm ?? 0}
          icon={Store}
          href="/admin/umkm-partners"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Produk"
          value={stats?.totalProducts ?? 0}
          icon={Package}
          href="/admin/products"
          isLoading={isLoading}
        />
        <StatCard
          title="Total Pesanan"
          value={stats?.totalOrders ?? 0}
          icon={ShoppingCart}
          href="/admin/orders"
          isLoading={isLoading}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Penjualan Minggu Ini</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={salesData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `Rp${Number(value) / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "hsl(var(--accent))" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar
                  dataKey="total"
                  fill="var(--nimo-yellow)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle>Verifikasi Menunggu</CardTitle>
            <CardDescription>
              Mitra UMKM baru yang membutuhkan persetujuan Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : pendingUmkms.length > 0 ? (
              pendingUmkms.map((umkm) => (
                <div key={umkm.id} className="flex items-center gap-4">
                  <Avatar className="hidden h-9 w-9 sm:flex">
                    <AvatarFallback>
                      <Building className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1">
                    <p className="text-sm font-medium">{umkm.umkmName}</p>
                    <p className="text-xs text-muted-foreground">
                      {umkm.user.email}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground pt-4">
                Tidak ada pendaftaran baru.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild size="sm" className="w-full">
              <Link href="/admin/verify-umkm">
                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pesanan Terbaru</CardTitle>
            <CardDescription>
              4 transaksi terakhir yang terjadi di platform.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center">
                  <div>
                    <p className="font-semibold">{order.customer.username}</p>
                    <p className="text-sm text-muted-foreground">
                      #{order.id.substring(0, 8)}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    {formatRupiah(Number(order.totalAmount))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground pt-4">
                Tidak ada pesanan terbaru.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produk dengan Rating Tertinggi</CardTitle>
            <CardDescription>
              5 produk terbaik berdasarkan ulasan pelanggan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))
            ) : topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center">
                  <div className="font-bold text-lg w-8">{index + 1}.</div>
                  <div>
                    <p className="font-semibold">{product.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.umkmOwner.umkmName}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 font-bold text-nimo-yellow">
                    <Star className="h-5 w-5 fill-current" />
                    <span>{product.averageRating.toFixed(1)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-center text-muted-foreground pt-4">
                Belum ada produk yang memiliki rating.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
