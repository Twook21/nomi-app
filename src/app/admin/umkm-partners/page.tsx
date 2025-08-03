"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/umkm/ProductDataTable"; 
import { getUmkmPartnerColumns } from "@/components/admin/UmkmPartnerTableColumns"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Store, ShieldCheck, Clock, Search } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { AdminUmkmProfile } from "@/types/admin_umkm"; 

interface UmkmStats {
  totalUmkm: number;
  verifiedUmkm: number;
  pendingUmkm: number;
}
interface GrowthData {
  month: string;
  total: number;
}

export default function ManageUmkmPartnersPage() {
  const { token } = useAuthStore();
  const [umkmList, setUmkmList] = useState<AdminUmkmProfile[]>([]);
  const [stats, setStats] = useState<UmkmStats | null>(null);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt"); 

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        isVerified: filter,
        search: searchTerm,
        sortBy: sortBy, 
      });
      const [listRes, statsRes, growthRes] = await Promise.all([
        fetch(
          `${
            process.env.NEXT_PUBLIC_API_BASE_URL
          }/admin/umkm-owners?${queryParams.toString()}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/umkm-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/umkm-growth-data`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);
      if (!listRes.ok || !statsRes.ok || !growthRes.ok)
        throw new Error("Gagal mengambil data UMKM.");

      setUmkmList(await listRes.json());
      setStats(await statsRes.json());
      setGrowthData(await growthRes.json());
    } catch (error) {
      toast.error("Gagal memuat data", {
        description:
          error instanceof Error ? error.message : "Coba lagi nanti.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, filter, searchTerm, sortBy]); 

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(handler);
  }, [fetchData]);

  const handleSuccessOnAction = () => {
    fetchData();
  };

  const columns = getUmkmPartnerColumns(handleSuccessOnAction);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mitra</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/3" />
            ) : (
              <div className="text-2xl font-bold">{stats?.totalUmkm}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terverifikasi</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/3" />
            ) : (
              <div className="text-2xl font-bold">{stats?.verifiedUmkm}</div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Menunggu Persetujuan
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-1/3" />
            ) : (
              <div className="text-2xl font-bold">{stats?.pendingUmkm}</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analisa Pertumbuhan Mitra</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={growthData}>
                <XAxis
                  dataKey="month"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
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
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Mitra UMKM</CardTitle>
          <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Cari mitra..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm font-medium self-center">Filter:</span>
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
                Terverifikasi
              </Button>
              <Button
                size="sm"
                variant={filter === "false" ? "default" : "outline"}
                onClick={() => setFilter("false")}
              >
                Pending
              </Button>
            </div>
            <div className="flex gap-2 flex-wrap border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-4 mt-4 md:mt-0">
              <span className="text-sm font-medium self-center">Urutkan:</span>
              <Button
                size="sm"
                variant={sortBy === "createdAt" ? "default" : "outline"}
                onClick={() => setSortBy("createdAt")}
              >
                Terbaru
              </Button>
              <Button
                size="sm"
                variant={sortBy === "totalTurnover" ? "default" : "outline"}
                onClick={() => setSortBy("totalTurnover")}
              >
                Omset
              </Button>
              <Button
                size="sm"
                variant={sortBy === "averageRating" ? "default" : "outline"}
                onClick={() => setSortBy("averageRating")}
              >
                Rating
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && umkmList.length === 0 ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <DataTable columns={columns} data={umkmList} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
