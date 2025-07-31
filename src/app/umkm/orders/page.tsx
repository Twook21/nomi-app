"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import type { UmkmOrder } from "@/types/umkm_order";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/umkm/ProductDataTable"; // Pastikan ini bisa digunakan untuk order
import { getOrderColumns } from "@/components/umkm/OrderTableColumns";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs components
import { Package, Truck, CheckCircle2, XCircle, Clock } from "lucide-react"; // Icons for status cards

// Skeleton untuk halaman daftar pesanan UMKM
function OrdersPageSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 space-y-6 animate-pulse">
            <h1 className="text-2xl font-bold mb-6"><Skeleton className="h-8 w-64" /></h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"> {/* For status summary cards */}
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
            <Skeleton className="h-10 w-full" /> {/* Tabs list */}
            <Card>
                <CardContent className="p-4">
                    <Skeleton className="h-96 w-full" /> {/* DataTable placeholder */}
                </CardContent>
            </Card>
        </div>
    );
}

// Tipe untuk Order Status Counts dari API
interface OrderStatusCounts {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    [key: string]: number; // Allow indexing with string
}

export default function UmkmOrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
  const { token, logout } = useAuthStore();

  const [orders, setOrders] = useState<UmkmOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('active'); // 'active' atau 'completed'
  const [orderStatusCounts, setOrderStatusCounts] = useState<OrderStatusCounts>({ // State untuk menyimpan hitungan status
      pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0
  });

  const fetchOrders = useCallback(async () => {
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

      // Tentukan filter status berdasarkan tab aktif
      let statusFilter: string[] = [];
      if (activeTab === 'active') {
          statusFilter = ['pending', 'processing', 'shipped'];
      } else if (activeTab === 'completed') {
          statusFilter = ['delivered', 'cancelled'];
      }

      // Bangun URL dengan parameter orderStatus
      const params = new URLSearchParams();
      statusFilter.forEach(status => params.append('orderStatus', status)); // Mengirim multiple orderStatus params
      const queryString = params.toString();

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/orders?${queryString}`, {
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error("Akses ditolak.", { description: "Anda tidak memiliki izin untuk melihat pesanan UMKM atau sesi Anda berakhir." });
          logout();
          router.push('/auth/login');
          return;
        }
        throw new Error((await response.json()).message || "Gagal mengambil data pesanan.");
      }
      
      const result = await response.json();
      setOrders(result.orders || []);
      setOrderStatusCounts(result.orderStatusCounts || { pending: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 }); // Simpan hitungan status
    } catch (error) {
      toast.error("Gagal memuat pesanan", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan server."
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, authMethod, token, logout, router, activeTab]); // Tambahkan activeTab ke dependencies

  useEffect(() => {
    if (!authLoading) {
        if (!isAuthenticated) {
            router.replace('/auth/login');
        } else if (user?.role !== 'umkm_owner') {
            toast.info("Anda tidak memiliki akses ke halaman ini.", { description: "Hanya UMKM owner yang dapat melihat pesanan." });
            router.replace('/profile');
        } else if (user.umkmProfileStatus !== 'verified') {
            toast.info("Profil UMKM Anda belum diverifikasi.", { description: "Mohon tunggu persetujuan admin untuk mengakses fitur ini." });
            router.replace('/profile/pending-verification');
        }
        else {
            fetchOrders();
        }
    }
  }, [authLoading, isAuthenticated, user, router, fetchOrders]);

  const columns = getOrderColumns(); // getOrderColumns mungkin perlu fungsi refresh data sebagai argumen

  // Tampilkan loading skeleton jika sedang loading auth atau data
  if (authLoading || isLoading) {
    return <OrdersPageSkeleton />;
  }

  // Tampilkan pesan jika tidak terautentikasi (setelah loading selesai)
  if (!isAuthenticated) {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center">
                <p className="text-muted-foreground">Silakan login untuk mengakses halaman pesanan UMKM Anda.</p>
                <Button asChild className="mt-4 bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                    <Link href="/auth/login">Login</Link>
                </Button>
            </div>
        </div>
    );
  }

  // Tampilkan pesan jika user bukan UMKM owner atau belum terverifikasi
  if (user?.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified') {
      return (
          <div className="container mx-auto py-8 px-4">
              <div className="text-center">
                  <p className="text-muted-foreground">Anda tidak memiliki izin untuk melihat pesanan UMKM atau profil Anda belum diverifikasi.</p>
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
      <h1 className="text-2xl font-bold mb-6">Pesanan Masuk</h1>
      
      {/* Ringkasan Status Pesanan */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStatusCounts.pending}</div>
            <p className="text-xs text-muted-foreground">Pesanan menunggu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStatusCounts.processing}</div>
            <p className="text-xs text-muted-foreground">Pesanan diproses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Truck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStatusCounts.shipped}</div>
            <p className="text-xs text-muted-foreground">Pesanan dikirim</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStatusCounts.delivered}</div>
            <p className="text-xs text-muted-foreground">Pesanan selesai</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStatusCounts.cancelled}</div>
            <p className="text-xs text-muted-foreground">Pesanan dibatalkan</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Pesanan Aktif</TabsTrigger>
          <TabsTrigger value="completed">Pesanan Selesai</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card className="mt-6"> {/* Tambahkan margin top jika perlu */}
            <CardHeader>
                <CardTitle>Daftar Pesanan Aktif</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="text-center p-8 text-muted-foreground">Memuat data pesanan aktif...</div>
              ) : (
                <DataTable columns={columns} data={orders} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card className="mt-6"> {/* Tambahkan margin top jika perlu */}
            <CardHeader>
                <CardTitle>Daftar Pesanan Selesai</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="text-center p-8 text-muted-foreground">Memuat data pesanan selesai...</div>
              ) : (
                <DataTable columns={columns} data={orders} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}