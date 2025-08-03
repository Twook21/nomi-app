// Tambahkan baris ini
'use client';
import React, { JSX } from 'react';
import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  ArrowRight,
  ShoppingBag,
  Package,
  ChevronRight,
  ShoppingCart,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Temporary interface for API response
interface ApiProduct {
  id: string;
  productName: string;
  description: string;
  originalPrice: string;
  discountedPrice: string;
  stock: number;
  imageUrl: string | null;
  expirationDate: string;
  isAvailable: boolean;
  categoryId: string;
  umkmOwner: {
    umkmName: string;
  };
}

interface DashboardData {
  recentActiveOrder: {
    id: string;
    orderStatus: string;
    totalAmount: number;
  } | null;
  frequentlyPurchased: ApiProduct[];
  authMethod?: "jwt" | "nextauth";
}

const statusLabels = {
  pending: "Menunggu Konfirmasi",
  processing: "Sedang Diproses",
  shipped: "Dalam Pengiriman",
  delivered: "Terkirim",
  cancelled: "Dibatalkan",
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getDiscountPercentage(original: string, discounted: string) {
  const originalPrice = parseInt(original);
  const discountedPrice = parseInt(discounted);
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// Minimal Product Card for Dashboard
function MinimalProductCard({ product }: { product: ApiProduct }) {
  const discountPercentage = getDiscountPercentage(
    product.originalPrice,
    product.discountedPrice
  );

  return (
    <Link
      href={`/products/${product.id}`}
      className="block flex-shrink-0 min-w-[260px] max-w-[260px]"
    >
      <Card className="group overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 bg-nimo-light border-nimo-dark/10">
        <div className="relative">
          {product.imageUrl && (
            <div className="relative h-48 bg-nimo-light overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.productName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-3 right-3 bg-nimo-yellow text-nimo-dark text-xs font-semibold px-2 py-1 rounded-full">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
          )}
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="font-semibold text-lg line-clamp-2 text-nimo-dark">
                {product.productName}
              </h3>
              <p className="text-sm text-nimo-dark/70 line-clamp-1">
                {product.umkmOwner.umkmName}
              </p>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-xl text-nimo-yellow">
                  {formatRupiah(parseInt(product.discountedPrice))}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-sm text-nimo-dark/40 line-through">
                    {formatRupiah(parseInt(product.originalPrice))}
                  </span>
                )}
              </div>
              <Button
                size="sm"
                className="bg-nimo-yellow hover:bg-nimo-yellow/90 text-nimo-dark font-medium rounded-full"
                onClick={(e) => {
                  e.preventDefault();
                  toast.success("Produk berhasil ditambahkan ke keranjang!");
                }}
              >
                Beli Lagi
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated, authMethod } = useAuth();
  const { token } = useAuthStore();
  const { data: session } = useSession();

  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Perhatikan: Tipe state sudah diubah ke JSX.Element | null
  const [greetingIcon, setGreetingIcon] = useState<JSX.Element | null>(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      let headers: HeadersInit = {};

      if (authMethod === "jwt" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/profile/dashboard-summary", {
        headers,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      setData(result.data || result);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Gagal memuat data dasbor.", {
        description:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tidak terduga",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authMethod, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const getGreetingIcon = () => {
      const hour = new Date().getHours();
      if (hour < 12) return <Sun className="h-8 w-8 text-white animate-spin-slow" />;
      if (hour < 17) return <Sun className="h-8 w-8 text-white animate-bounce-slow" />;
      return <Moon className="h-8 w-8 text-white animate-pulse" />;
    };
    setGreetingIcon(getGreetingIcon());
  }, []);

  const getDisplayName = () => {
    if (authMethod === "nextauth") {
      return (
        user?.name ||
        session?.user?.name ||
        user?.email?.split("@")[0] ||
        "Pengguna"
      );
    }
    return (
      user?.username || user?.name || user?.email?.split("@")[0] || "Pengguna"
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 17) return "Selamat Siang";
    return "Selamat Malam";
  };
  

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nimo-light p-4">
        <Card className="w-full max-w-md text-center shadow-2xl rounded-2xl animate-fade-in bg-nimo-light">
          <CardHeader className="p-8 pb-0">
            <User className="h-20 w-20 text-nimo-dark mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold text-nimo-dark">
              Akses Ditolak
            </CardTitle>
            <CardDescription className="text-nimo-dark/70 mt-2">
              Silakan login untuk mengakses dashboard Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Button
              asChild
              className="w-full py-3 bg-nimo-yellow text-nimo-dark hover:bg-nimo-yellow/90 transition-colors duration-200 ease-in-out rounded-xl text-lg font-medium"
            >
              <Link href="/auth/login">Login Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nimo-light text-nimo-dark">
      {/* Header dengan hiasan dan animasi */}
      <div className="bg-nimo-yellow relative overflow-hidden">
        {/* Hiasan background tambahan */}
        <div className="absolute inset-0 bg-yellow-300 opacity-10 bg-[radial-gradient(circle_at_center,rgba(255,255,0,0.2)_0%,transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[url('/images/subtle-pattern.png')] opacity-15 bg-repeat"></div>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-nimo-yellow/80 to-transparent"></div>

        {/* Konten utama header */}
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="flex items-center gap-6">
            {/* Tampilkan ikon dari state yang sudah diatur di client */}
            {greetingIcon}
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold text-white tracking-tight bg-clip-text bg-gradient-to-r from-white to-yellow-200 animate-gradient-slow">
                {getGreeting()}, {getDisplayName()}!
              </h1>
              <p className="text-lg text-white/90">
                Selamat datang kembali di NOMI, mari kelola aktivitas Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Konten Dashboard lainnya */}
      <div className="container mx-auto px-4 py-8 space-y-10">
        <section>
          {isLoading ? (
            <Skeleton className="h-40 w-full rounded-2xl" />
          ) : data?.recentActiveOrder ? (
            <Card className="rounded-2xl shadow-xl border-none overflow-hidden bg-nimo-light">
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex items-start sm:items-center space-x-4 mb-4 sm:mb-0">
                  <div className="flex-shrink-0 p-4 bg-nimo-yellow text-nimo-dark rounded-xl shadow-lg">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-nimo-yellow uppercase tracking-wide">
                        Pesanan Aktif
                      </span>
                      <Badge
                        variant="outline"
                        className="text-xs text-nimo-dark/50 bg-nimo-light/50 font-normal"
                      >
                        #{data.recentActiveOrder.id.substring(0, 8)}
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold">
                      {
                        statusLabels[
                          data.recentActiveOrder
                            .orderStatus as keyof typeof statusLabels
                        ]
                      }
                    </h3>
                    <p className="text-nimo-dark/70">
                      Total:{" "}
                      <span className="font-bold">
                        {formatRupiah(
                          Number(data.recentActiveOrder.totalAmount)
                        )}
                      </span>
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  variant="default"
                  className="w-full sm:w-auto px-6 py-2 bg-nimo-yellow hover:bg-nimo-yellow/90 text-nimo-dark rounded-xl font-semibold"
                >
                  <Link href={`/profile/orders/${data.recentActiveOrder.id}`}>
                    Lihat Detail
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-2xl shadow-xl border-dashed border-nimo-dark/20 bg-nimo-light">
              <CardContent className="p-6 flex flex-col items-start sm:items-center justify-between">
                <div className="flex items-start sm:items-center space-x-4 mb-4 sm:mb-0">
                  <div className="flex-shrink-0 p-4 bg-nimo-light text-nimo-dark/50 rounded-xl">
                    <ShoppingCart className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-nimo-dark">
                      Mulai Belanja
                    </h3>
                    <p className="text-nimo-dark/70">
                      Jelajahi produk berkualitas dari UMKM lokal.
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  className="w-full sm:w-auto px-6 py-2 bg-nimo-yellow hover:bg-nimo-yellow/90 text-nimo-dark rounded-xl font-semibold"
                >
                  <Link href="/products">
                    Lihat Produk
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-nimo-dark">
              Sering Anda Beli
            </h2>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-nimo-yellow hover:bg-nimo-yellow/10 font-semibold"
            >
              <Link href="/products">
                Lihat Semua
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="flex space-x-6 pb-4 overflow-x-auto custom-scroll">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="min-w-[260px] h-[350px] rounded-2xl flex-shrink-0"
                />
              ))}
            </div>
          ) : data &&
            data.frequentlyPurchased &&
            data.frequentlyPurchased.length > 0 ? (
            <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 custom-scroll">
              {data.frequentlyPurchased.map((product) => (
                <MinimalProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed border-nimo-dark/20 rounded-2xl bg-nimo-light">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Package className="w-20 h-20 text-nimo-dark/30 mb-6" />
                <h3 className="text-2xl font-bold text-nimo-dark mb-2">
                  Belum Ada Pembelian
                </h3>
                <p className="text-nimo-dark/70 mb-8 max-w-sm">
                  Mulai berbelanja untuk melihat produk favorit Anda di sini.
                </p>
                <Button
                  asChild
                  className="bg-nimo-yellow hover:bg-nimo-yellow/90 text-nimo-dark px-6 py-2 rounded-xl font-semibold"
                >
                  <Link href="/products">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Mulai Belanja
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}