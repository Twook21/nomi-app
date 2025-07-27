"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  ShoppingCart,
  DollarSign,
  Star,
  Trophy,
  TrendingUp,
  CalendarDays,
  HeartHandshake,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePickerWithRange } from "@/components/ui/DateRangePicker";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import type { AdminUmkmDetail } from "@/types/admin_umkm_detail";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

// --- HELPER FUNCTIONS ---
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  });
}
function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// --- SKELETON COMPONENT ---
function UmkmDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <Skeleton className="h-10 w-full sm:w-80 mt-4 sm:mt-0" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function UmkmPartnerDetailPage() {
  const params = useParams();
  const { token } = useAuthStore();
  const [umkm, setUmkm] = useState<AdminUmkmDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const umkmId = params.id as string;
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });

  const fetchUmkmDetail = useCallback(async () => {
    if (!token || !umkmId) return;
    setIsLoading(true);

    const queryParams = new URLSearchParams();
    if (date?.from) queryParams.append("startDate", date.from.toISOString());
    if (date?.to) queryParams.append("endDate", date.to.toISOString());

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL
        }/admin/umkm-owners/${umkmId}?${queryParams.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Gagal mengambil detail mitra.");
      const result = await response.json();
      setUmkm(result);
    } catch (error) {
      toast.error("Gagal memuat detail.", {
        description: error instanceof Error ? error.message : "",
      });
      setUmkm(null);
    } finally {
      setIsLoading(false);
    }
  }, [token, umkmId, date]);

  useEffect(() => {
    fetchUmkmDetail();
  }, [fetchUmkmDetail]);

  if (isLoading) return <UmkmDetailSkeleton />;
  if (!umkm)
    return (
      <div className="p-8 text-center text-muted-foreground">
        Gagal memuat data atau mitra tidak ditemukan.
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{umkm.umkmName}</h1>
          <p className="text-muted-foreground">
            Detail profil dan analitik mitra UMKM.
          </p>
        </div>
        <DatePickerWithRange
          date={date}
          setDate={setDate}
          className="w-full sm:w-auto"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pendapatan
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(Number(umkm.stats.totalRevenue))}
            </div>
            <p className="text-xs text-muted-foreground">
              dalam rentang tanggal terpilih
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Pendapatan Harian
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatRupiah(umkm.stats.averageDailyRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              dalam rentang tanggal terpilih
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{umkm.stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">
              dalam rentang tanggal terpilih
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rata-rata Pesanan Harian
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {umkm.stats.averageDailyOrders.toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              dalam rentang tanggal terpilih
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produk Terselamatkan
            </CardTitle>
            <HeartHandshake className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{umkm.stats.foodSaved}</div>
            <p className="text-xs text-muted-foreground">
              unit produk hampir kedaluwarsa
            </p>
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
            <div className="text-lg font-bold truncate">
              {umkm.bestSeller?.productName || "-"}
            </div>
            <p className="text-xs text-muted-foreground">{`${
              umkm.bestSeller?.totalSold || 0
            } unit terjual (rentang terpilih)`}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analisa Omset (6 Bulan Terakhir)</CardTitle>
          <CardDescription>
            Tren pendapatan kotor dari penjualan produk.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={umkm.monthlyTurnover}>
              <XAxis dataKey="month" stroke="#888888" fontSize={12} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickFormatter={(value) => `Rp${Number(value) / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                }}
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
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informasi Mitra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <p className="font-semibold">Status</p>
              <Badge variant={umkm.isVerified ? "default" : "destructive"}>
                {umkm.isVerified ? "Terverifikasi" : "Belum Diverifikasi"}
              </Badge>
            </div>
            <div>
              <p className="font-semibold">Alamat Toko</p>
              <p className="text-muted-foreground">{umkm.umkmAddress}</p>
            </div>
            <div>
              <p className="font-semibold">Email Toko</p>
              <p className="text-muted-foreground">{umkm.umkmEmail}</p>
            </div>
            <div>
              <p className="font-semibold">Telepon Toko</p>
              <p className="text-muted-foreground">{umkm.umkmPhoneNumber}</p>
            </div>
            <Separator />
            <div>
              <p className="font-semibold">Pemilik Akun</p>
              <p className="text-muted-foreground">{umkm.user.username}</p>
            </div>
            <div>
              <p className="font-semibold">Bergabung Sejak</p>
              <p className="text-muted-foreground">
                {formatDate(umkm.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pesanan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            {umkm.recentOrders.length > 0 ? (
              <ul className="space-y-3">
                {umkm.recentOrders.map((o) => (
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
      </div>
    </div>
  );
}
