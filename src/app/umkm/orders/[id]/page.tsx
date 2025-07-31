"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import type { UmkmOrder } from "@/types/umkm_order";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}
function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleString("id-ID", { dateStyle: 'long', timeStyle: 'short' });
  } catch {
    return "Invalid Date";
  }
}
const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    pending: "secondary", processing: "outline", shipped: "default", delivered: "default", cancelled: "destructive",
};
const orderStatuses: UmkmOrder['orderStatus'][] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

// Skeleton untuk halaman detail pesanan UMKM
function OrderDetailPageSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 grid gap-4 md:grid-cols-3 animate-pulse">
            <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-20 w-full" /> {/* Order info card */}
                <Skeleton className="h-64 w-full" /> {/* Order items card */}
            </div>
            <div className="md:col-span-1 space-y-4">
                <Skeleton className="h-48 w-full" /> {/* Customer details card */}
                <Skeleton className="h-32 w-full" /> {/* Change status card */}
            </div>
        </div>
    );
}

export default function UmkmOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  // Gunakan useAuth hook untuk status otentikasi terpadu
  const { user, isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
  // Ambil token dan logout dari useAuthStore
  const { token, logout } = useAuthStore();

  const [order, setOrder] = useState<UmkmOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const orderId = params.id as string;

  const fetchOrder = useCallback(async () => {
    // Hanya fetch jika sudah terautentikasi dan merupakan UMKM owner, dan orderId ada
    if (!isAuthenticated || !user || user.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified' || !orderId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      let headers: HeadersInit = {};
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/orders/${orderId}`, {
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error("Akses ditolak.", { description: "Anda tidak memiliki izin untuk melihat detail pesanan ini atau sesi Anda berakhir." });
          logout();
          router.push('/auth/login');
          return;
        } else if (response.status === 404) {
            toast.error("Pesanan tidak ditemukan.", { description: "Pesanan yang Anda cari tidak ada." });
            setOrder(null); // Set order to null to show not found message
            return;
        }
        throw new Error((await response.json()).message || "Gagal mengambil detail pesanan.");
      }
      const result = await response.json();
      setOrder(result);
    } catch (error) {
      toast.error("Gagal memuat pesanan.", { description: error instanceof Error ? error.message : "Terjadi kesalahan." });
      setOrder(null); // Set order to null on general error
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, authMethod, token, orderId, router, logout]);

  useEffect(() => {
    // Panggil fetchOrder hanya jika status autentikasi sudah selesai dimuat dan orderId ada
    if (!authLoading && orderId) {
        if (!isAuthenticated) {
            router.replace('/auth/login');
        } else if (user?.role !== 'umkm_owner') {
            toast.info("Anda tidak memiliki akses ke halaman ini.", { description: "Hanya UMKM owner yang dapat melihat detail pesanan." });
            router.replace('/profile');
        } else if (user.umkmProfileStatus !== 'verified') {
            toast.info("Profil UMKM Anda belum diverifikasi.", { description: "Mohon tunggu persetujuan admin untuk mengakses fitur ini." });
            router.replace('/profile/pending-verification');
        }
        else {
            fetchOrder();
        }
    }
  }, [authLoading, isAuthenticated, user, orderId, router, fetchOrder]);

  const handleStatusUpdate = async (newStatus: UmkmOrder['orderStatus']) => {
    // Cek otorisasi lagi sebelum update status
    if (!isAuthenticated || !user || user.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified' || !orderId) {
        toast.error("Tidak dapat memperbarui status. Sesi berakhir atau Anda tidak memiliki izin.");
        logout();
        router.push('/auth/login');
        return;
    }

    toast.loading("Memperbarui status...");
    try {
      let headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/orders/${orderId}/status`, {
        method: 'PUT',
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
              toast.error("Akses ditolak.", { description: "Sesi Anda berakhir atau Anda tidak memiliki izin." });
              logout();
              router.push('/auth/login');
              return;
          } else if (response.status === 404) {
              toast.error("Pesanan tidak ditemukan.", { description: "Pesanan ini tidak ada atau bukan milik Anda." });
              return;
          }
          throw new Error((await response.json()).message || "Gagal memperbarui status.");
      }
      toast.success("Status pesanan berhasil diperbarui!");
      fetchOrder(); // Muat ulang data untuk menampilkan status terbaru
    } catch (error) {
      toast.error("Gagal memperbarui status.", { description: error instanceof Error ? error.message : "Terjadi kesalahan." });
    }
  };

  // Tampilkan loading skeleton jika sedang loading auth atau data
  if (authLoading || isLoading) {
    return <OrderDetailPageSkeleton />;
  }

  // Tampilkan pesan jika tidak terautentikasi (setelah loading selesai)
  if (!isAuthenticated) {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center">
                <p className="text-muted-foreground">Silakan login untuk mengakses detail pesanan UMKM Anda.</p>
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
                  <p className="text-muted-foreground">Anda tidak memiliki izin untuk melihat detail pesanan UMKM atau profil Anda belum diverifikasi.</p>
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

  // Jika pesanan tidak ditemukan setelah loading selesai dan user terotorisasi
  if (!order) {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center">
                <p className="text-muted-foreground">Pesanan tidak ditemukan atau Anda tidak memiliki akses.</p>
                <Button asChild className="mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300">
                    <Link href="/umkm/orders">Kembali ke Daftar Pesanan</Link>
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4"> {/* Tambahkan container */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Pesanan #{order.id.substring(0, 8)}</CardTitle>
                <CardDescription>Dibuat pada {formatDate(order.createdAt)}</CardDescription>
              </div>
              <Badge variant={statusVariant[order.orderStatus]} className="capitalize text-sm">{order.orderStatus}</Badge>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <div className="space-y-4">
                {order.orderItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Image src={item.product.imageUrl || 'https://placehold.co/64'} alt={item.product.productName} width={64} height={64} className="rounded-md border object-cover"/>
                      <div>
                        <p className="font-medium">{item.product.productName}</p>
                        <p className="text-sm text-muted-foreground">{item.quantity} x {formatRupiah(Number(item.pricePerItem))}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{formatRupiah(item.quantity * Number(item.pricePerItem))}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detail Pelanggan</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-medium">{order.customer?.name || order.customer?.username || 'Pelanggan'}</p> {/* Fallback name/username */}
              <p className="text-muted-foreground">{order.customer?.email}</p>
              <p className="text-muted-foreground">{order.customer?.phoneNumber || 'N/A'}</p> {/* Fallback phone */}
              <Separator className="my-4" />
              <h3 className="font-semibold">Alamat Pengiriman</h3>
              <p className="text-muted-foreground">{order.shippingAddress}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Ubah Status</CardTitle></CardHeader>
            <CardContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="capitalize">{order.orderStatus}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {orderStatuses.map(status => (
                    <DropdownMenuItem key={status} onSelect={() => handleStatusUpdate(status)} className="capitalize">
                      {status}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}