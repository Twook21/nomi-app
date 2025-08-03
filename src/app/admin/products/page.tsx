"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { DataTable } from "@/components/umkm/ProductDataTable";
import { getAdminProductColumns } from "@/components/admin/AdminProductTableColumns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  CheckCircle,
  AlertTriangle,
  Search,
  Trophy,
  Star,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { differenceInDays } from "date-fns";
import type { Product } from "@/types/product";

// --- INTERFACES & CONSTANTS ---
interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  nearingExpiryProducts: number;
  bestSeller: { productName: string; totalSold: number | null } | null;
  highestRated: { productName: string; averageRating: number | null } | null;
}
// Interfaces dari pembaruan
interface SalesData {
  name: string;
  total: number;
}
interface ExpiringProduct {
  id: string;
  productName: string;
  expirationDate: string;
  umkmOwner: {
    umkmName: string;
  };
}


export default function ManageProductsPage() {
  const { token } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [expiringProducts, setExpiringProducts] = useState<ExpiringProduct[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filter !== "all") queryParams.append("isAvailable", filter);
      if (searchTerm) queryParams.append("search", searchTerm);

      const [listRes, statsRes, salesRes, expiringRes] = await Promise.all([
        fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }/admin/products?${queryParams.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/product-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/sales-data`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/expiring-products`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      if (!listRes.ok || !statsRes.ok || !salesRes.ok || !expiringRes.ok) {
        throw new Error("Gagal mengambil sebagian data dasbor.");
      }

      setProducts(await listRes.json());
      setStats(await statsRes.json());
      setSalesData(await salesRes.json());
      setExpiringProducts(await expiringRes.json());
    } catch (error) {
      toast.error("Gagal memuat data", {
        description:
          error instanceof Error ? error.message : "Coba lagi nanti.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, filter, searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 500); 
    return () => clearTimeout(handler);
  }, [fetchData]);

  const handleSuccessOnAction = () => {
    fetchData();
  };

  const columns = getAdminProductColumns(handleSuccessOnAction);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/3" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalProducts}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produk Aktif</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/3" />
            ) : (
              <div className="text-2xl font-bold">{stats?.activeProducts}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hampir Kedaluwarsa
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/3" />
            ) : (
              <div className="text-2xl font-bold">
                {stats?.nearingExpiryProducts}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produk Terlaris
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-lg font-bold truncate">
                  {stats?.bestSeller?.productName || "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.bestSeller
                    ? `${stats.bestSeller.totalSold} terjual`
                    : ""}
                </p>
              </>
            )}
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
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <>
                <div className="text-lg font-bold truncate">
                  {stats?.highestRated?.productName || "-"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.highestRated
                    ? `Avg. ${stats.highestRated.averageRating?.toFixed(1)} ★`
                    : ""}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Penjualan Minggu Ini</CardTitle>
            <CardDescription>
              Total penjualan per hari dalam 7 hari terakhir.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {isLoading ? (
              <div className="flex justify-center items-center h-[350px]">
                <Skeleton className="w-full h-[300px]" />
              </div>
            ) : (
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
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Bar
                    dataKey="total"
                    fill="#FBBF24"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-4 md:col-span-3">
          <CardHeader>
            <CardTitle>Produk Kritis</CardTitle>
            <CardDescription>
              Produk yang akan kedaluwarsa dalam 7 hari ke depan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="space-y-4 pt-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : expiringProducts.length > 0 ? (
              expiringProducts.map((product) => {
                const daysLeft = differenceInDays(
                  new Date(product.expirationDate),
                  new Date()
                );
                return (
                  <div key={product.id} className="flex items-center">
                    <div>
                      <p className="font-semibold">{product.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.umkmOwner.umkmName}
                      </p>
                    </div>
                    <Badge
                      variant={daysLeft <= 3 ? "destructive" : "outline"}
                      className="ml-auto"
                    >
                      {daysLeft <= 0 ? "Hari ini" : `${daysLeft} hari lagi`}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-8 h-full">
                <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Tidak ada produk kritis saat ini.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <>
            <CardTitle>Daftar Semua Produk</CardTitle>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Cari produk atau nama UMKM..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                >
                  Semua
                </Button>
                <Button
                  size="sm"
                  variant={filter === "true" ? "default" : "outline"}
                  onClick={() => setFilter("true")}
                >
                  Aktif
                </Button>
                <Button
                  size="sm"
                  variant={filter === "false" ? "default" : "outline"}
                  onClick={() => setFilter("false")}
                >
                  Nonaktif
                </Button>
              </div>
            </div>
          </>
        </CardHeader>
        <CardContent>
          {isLoading && products.length === 0 ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <DataTable columns={columns} data={products} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
