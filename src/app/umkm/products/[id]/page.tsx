"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth";
import type { Product, Review } from "@/types/product";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ShoppingCart, MessageSquare, PackageCheck, Clock, Edit } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProductStats {
  totalSold: number;
}

function formatRupiah(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(amount);
}
function formatDate(dateString: string) {
    try {
        return new Date(dateString).toLocaleDateString("id-ID", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } catch (e) {
        console.error("Invalid date string for formatting:", dateString, e);
        return "Tanggal tidak valid";
    }
}

function ProductDetailSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 space-y-6 animate-pulse">
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-10 w-96" /> 
                <Skeleton className="h-10 w-32" /> 
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                <Skeleton className="md:col-span-1 lg:col-span-1 aspect-square w-full rounded-lg" />

                <div className="md:col-span-1 lg:col-span-1 flex flex-col space-y-3">
                    <Skeleton className="h-8 w-full" /> 
                    <Skeleton className="h-4 w-1/2" /> 
                    <Skeleton className="h-8 w-2/3 mt-2" /> 
                    <Skeleton className="h-6 w-full mt-4" /> 
                    <Skeleton className="h-6 w-full" /> 
                </div>

                <div className="md:col-span-2 lg:col-span-1 space-y-4"> 
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-4 rounded-full" /></CardHeader><CardContent><Skeleton className="h-8 w-full" /></CardContent></Card>
                    <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-4 w-4 rounded-full" /></CardHeader><CardContent><Skeleton className="h-8 w-full" /></CardContent></Card>
                </div>
            </div>

            <Card className="mb-8">
                <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
                <CardContent><Skeleton className="h-24 w-full" /></CardContent>
            </Card>

            <Card>
                <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
                <CardContent><Skeleton className="h-48 w-full" /></CardContent>
            </Card>
        </div>
    );
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
  const { token, logout } = useAuthStore();

  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !user || user.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified' || !productId) {
      setIsLoading(false);
      return;
    }

    try {
      let headers: HeadersInit = {};
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const [productRes, statsRes, reviewsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/products/${productId}`, { 
            headers, 
            credentials: authMethod === 'nextauth' ? 'include' : 'omit' 
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}/analytics`, { 
            headers, 
            credentials: authMethod === 'nextauth' ? 'include' : 'omit' 
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}/reviews`, { 
            headers: authMethod === 'jwt' && token ? { 'Authorization': `Bearer ${token}` } : {},
            credentials: authMethod === 'nextauth' ? 'include' : 'omit',
        })
      ]);

      if (!productRes.ok) {
        if (productRes.status === 401 || productRes.status === 403) {
            toast.error("Akses ditolak.", { description: "Anda tidak memiliki izin untuk melihat detail produk ini atau sesi Anda berakhir." });
            logout();
            router.push('/auth/login');
            return;
        } else if (productRes.status === 404) {
            toast.error("Produk tidak ditemukan.", { description: "Produk yang Anda cari tidak ada." });
            setProduct(null);
            return;
        }
        throw new Error((await productRes.json()).message || "Gagal mengambil data produk.");
      }
      if (!statsRes.ok) {
        console.error("Failed to fetch product analytics:", await statsRes.json());
      }

      setProduct(await productRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
      if (reviewsRes.ok) setReviews(await reviewsRes.json());

    } catch (error) {
      toast.error("Gagal memuat data", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan.",
      });
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, authMethod, token, productId, router, logout]);

  useEffect(() => {
    if (!authLoading && productId) {
        if (!isAuthenticated) {
            router.replace('/auth/login');
        } else if (user?.role !== 'umkm_owner') {
            toast.info("Anda tidak memiliki akses ke halaman ini.", { description: "Hanya UMKM owner yang dapat melihat analitik produk." });
            router.replace('/profile');
        } else if (user.umkmProfileStatus !== 'verified') {
            toast.info("Profil UMKM Anda belum diverifikasi.", { description: "Mohon tunggu persetujuan admin untuk mengakses fitur ini." });
            router.replace('/profile/pending-verification');
        }
        else {
            fetchData();
        }
    }
  }, [authLoading, isAuthenticated, user, productId, router, fetchData]);

  if (authLoading || isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!isAuthenticated) {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center">
                <p className="text-muted-foreground">Silakan login untuk mengakses analitik produk UMKM Anda.</p>
                <Button asChild className="mt-4 bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                    <Link href="/auth/login">Login</Link>
                </Button>
            </div>
        </div>
    );
  }

  if (user?.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified') {
      return (
          <div className="container mx-auto py-8 px-4">
              <div className="text-center">
                  <p className="text-muted-foreground">Anda tidak memiliki izin untuk melihat analitik produk UMKM atau profil Anda belum diverifikasi.</p>
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

  if (!product) {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center">
                <p className="text-muted-foreground">Produk tidak ditemukan atau Anda tidak memiliki akses.</p>
                <Button asChild className="mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300">
                    <Link href="/umkm/products">Kembali ke Daftar Produk</Link>
                </Button>
            </div>
        </div>
    );
  }

  const discountPercentage = product.originalPrice && product.discountedPrice !== undefined && product.originalPrice > product.discountedPrice
    ? Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Analitik Produk: {product.productName}</h1>
        <Button asChild variant="outline" className="text-primary hover:text-primary">
            <Link href={`/umkm/products/${product.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" /> Edit Produk
            </Link>
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"> 
        <div className="md:col-span-1 lg:col-span-1 relative aspect-square w-full rounded-lg overflow-hidden border">
            <Image 
                src={product.imageUrl || 'https://placehold.co/600x600?text=No+Image'} 
                alt={product.productName} 
                fill 
                style={{ objectFit: 'cover' }} 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {discountPercentage > 0 && (
                <Badge 
                    variant="destructive" 
                    className="absolute top-3 right-3 text-base z-10"
                >
                    {discountPercentage}% OFF
                </Badge>
            )}
        </div>

        <div className="md:col-span-1 lg:col-span-1 flex flex-col space-y-3">
            <h2 className="text-2xl font-bold">{product.productName}</h2>
            <p className="text-sm text-muted-foreground">Kategori: <span className="font-medium text-foreground">{product.category?.categoryName || 'Tidak Diketahui'}</span></p>

            <div className="space-y-1 mt-2">
                <p className="text-3xl font-bold text-nimo-yellow">
                    {formatRupiah(product.discountedPrice)}
                </p>
                {discountPercentage > 0 && (
                    <p className="text-xl text-muted-foreground line-through">
                        {formatRupiah(product.originalPrice)}
                    </p>
                )}
            </div>

            <div className="space-y-2 mt-4">
                <div className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-nimo-yellow"/>
                    <span className="font-medium">Stok: {product.stock} unit</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600"/>
                    <span className="font-medium">Kedaluwarsa: {formatDate(product.expirationDate)}</span>
                </div>
            </div>
        </div>

        <div className="md:col-span-2 lg:col-span-1 space-y-4"> 
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rating Rata-rata</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{product.averageRating?.toFixed(1) ?? '0.0'} ★</div>
                    <p className="text-xs text-muted-foreground">dari {reviews.length} ulasan</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Terjual</CardTitle>
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalSold ?? '0'}</div>
                    <p className="text-xs text-muted-foreground">unit terjual</p>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <Card className="mb-8">
          <CardHeader><CardTitle>Deskripsi Produk</CardTitle></CardHeader>
          <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                  {product.description || 'Tidak ada deskripsi tersedia.'}
              </p>
          </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ulasan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-semibold">{review.customer?.name ?? 'Customer'}</p>
                      <span className="flex items-center text-xs text-muted-foreground">
                        <Star className="h-3 w-3 mr-1 fill-yellow-500 text-yellow-500" /> {review.rating.toFixed(1)}
                      </span>
                    </div>
                    {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-center text-muted-foreground py-4">Belum ada ulasan untuk produk ini.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}