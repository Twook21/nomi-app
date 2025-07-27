"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import type { Product, Review } from "@/types/product";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, ShoppingCart, MessageSquare } from "lucide-react";

// Tipe data untuk statistik sekarang lebih sederhana
interface ProductStats {
  totalSold: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const { token } = useAuthStore();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || !productId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productRes, statsRes, reviewsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/products/${productId}`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}/analytics`, { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${productId}/reviews`, { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (!productRes.ok) throw new Error("Gagal mengambil data produk.");
        
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
    };
    
    fetchData();
  }, [token, productId]);

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Memuat data analitik produk...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center text-destructive">Produk tidak ditemukan atau Anda tidak memiliki akses.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Analitik Produk: {product.productName}</h1>
      
      {/* [PERBAIKAN] Grid sekarang memiliki 2 kolom untuk layar besar */}
      <div className="grid gap-4 md:grid-cols-2">
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
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Terjual</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSold ?? '0'}</div>
            <p className="text-xs text-muted-foreground">unit terjual</p>
          </CardContent>
        </Card> */}
        {/* Kartu "Total Dilihat" sudah dihapus */}
      </div>
      
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
                      <p className="font-semibold">{review.customer?.username ?? 'Customer'}</p>
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