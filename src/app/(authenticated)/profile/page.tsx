"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  ArrowRight, 
  ShoppingCart, 
  Package, 
  Clock,
  ChevronRight
} from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import type { Product } from "@/types/product";
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
  authMethod?: 'jwt' | 'nextauth';
}

const statusLabels = {
  pending: "Menunggu Konfirmasi",
  processing: "Sedang Diproses",
  shipped: "Dalam Pengiriman", 
  delivered: "Terkirim",
  cancelled: "Dibatalkan"
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { 
    style: "currency", 
    currency: "IDR", 
    minimumFractionDigits: 0 
  }).format(amount);
}

function getDiscountPercentage(original: string, discounted: string) {
  const originalPrice = parseInt(original);
  const discountedPrice = parseInt(discounted);
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// Helper function to convert API product to frontend Product
function convertApiProductToProduct(apiProduct: ApiProduct): Product {
  return {
    ...apiProduct,
    originalPrice: parseInt(apiProduct.originalPrice),
    discountedPrice: parseInt(apiProduct.discountedPrice),
    category: null,
    totalSold: 0,
    averageRating: 0,
    reviews: [],
  };
}

// Minimal Product Card for Dashboard
function MinimalProductCard({ product }: { product: ApiProduct }) {
  const discountPercentage = getDiscountPercentage(product.originalPrice, product.discountedPrice);

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200 min-w-[260px] max-w-[260px] flex-shrink-0">
      <div className="relative">
        {product.imageUrl && (
          <div className="relative h-40 bg-gray-50 rounded-t-lg overflow-hidden">
            <img 
              src={product.imageUrl} 
              alt={product.productName}
              className="w-full h-full object-cover"
            />
            {discountPercentage > 0 && (
              <Badge className="absolute top-2 left-2 bg-nimo-yellow hover:bg-nimo-yellow text-white text-xs">
                -{discountPercentage}%
              </Badge>
            )}
          </div>
        )}
        
        <CardContent className="p-4 space-y-3">
          <div className="space-y-2">
            <h3 className="font-medium text-base line-clamp-1">
              {product.productName}
            </h3>
            
            <p className="text-sm text-gray-500 line-clamp-1">
              {product.umkmOwner.umkmName}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-nimo-yellow">
                {formatRupiah(parseInt(product.discountedPrice))}
              </span>
              {discountPercentage > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  {formatRupiah(parseInt(product.originalPrice))}
                </span>
              )}
            </div>
            
            <Button asChild size="sm" className="w-full bg-nimo-yellow hover:bg-nimo-yellow/90 text-white">
              <Link href={`/products/${product.id}`}>
                Beli Lagi
              </Link>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated, authMethod } = useAuth();
  const { token } = useAuthStore();
  const { data: session } = useSession();
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      let headers: HeadersInit = {};
      
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/profile/dashboard-summary', {
        headers,
        credentials: 'include',
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
        description: error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga"
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authMethod, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDisplayName = () => {
    if (authMethod === 'nextauth') {
      return user?.name || session?.user?.name || user?.email?.split('@')[0] || 'Pengguna';
    }
    return user?.username || user?.name || user?.email?.split('@')[0] || 'Pengguna';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 17) return "Selamat Siang";
    return "Selamat Malam";
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Akses Ditolak
            </CardTitle>
            <CardDescription className="text-gray-600">
              Silakan login untuk mengakses dashboard Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="mt-6 w-full py-2 bg-nimo-yellow text-white hover:bg-nimo-yellow/90 transition-colors duration-200 ease-in-out rounded-md text-lg font-medium"
            >
              <Link href="/auth/login">Login Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900">
              {getGreeting()}, {getDisplayName()}
            </h1>
            <p className="text-gray-600">
              Selamat datang kembali di dashboard Anda
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Order Status Section */}
        {isLoading ? (
          <Skeleton className="h-32 w-full rounded-lg" />
        ) : data?.recentActiveOrder ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      Pesanan #{data.recentActiveOrder.id.substring(0,8)}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium">
                    {statusLabels[data.recentActiveOrder.orderStatus as keyof typeof statusLabels]}
                  </h3>
                  <p className="text-gray-600">
                    {formatRupiah(Number(data.recentActiveOrder.totalAmount))}
                  </p>
                </div>
                <Button asChild variant="outline">
                  <Link href={`/profile/orders/${data.recentActiveOrder.id}`}>
                    Lihat Detail
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium">Mulai Belanja</h3>
                  <p className="text-gray-600">
                    Jelajahi produk dan mulai berbelanja
                  </p>
                </div>
                <Button asChild className="bg-nimo-yellow hover:bg-nimo-yellow/90 text-white">
                  <Link href="/products">
                    Lihat Produk
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Frequently Purchased Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Sering Anda Beli</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/products">
                Lihat Semua
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex space-x-4 pb-4 overflow-x-auto">
              {Array.from({length: 4}).map((_, i) => (
                <Skeleton key={i} className="min-w-[260px] h-[280px] rounded-lg flex-shrink-0" />
              ))}
            </div>
          ) : data && data.frequentlyPurchased && data.frequentlyPurchased.length > 0 ? (
            <div className="flex overflow-x-auto space-x-4 pb-4 -mx-4 px-4">
              {data.frequentlyPurchased.map(product => (
                <MinimalProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="w-12 h-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Pembelian</h3>
                <p className="text-gray-600 mb-6 max-w-sm">
                  Mulai berbelanja untuk melihat produk favorit Anda di sini
                </p>
                <Button asChild className="bg-nimo-yellow hover:bg-nimo-yellow/90 text-white">
                  <Link href="/products">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Mulai Belanja
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}