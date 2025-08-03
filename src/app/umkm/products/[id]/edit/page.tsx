"use client";

import { useEffect, useState, useCallback } from "react"; 
import { useParams, useRouter } from "next/navigation"; 
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth"; 
import type { Product } from "@/types/product";
import { toast } from "sonner";
import { ProductForm } from "@/components/umkm/ProductForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; 
import { Button } from "@/components/ui/button"; 
import Link from "next/link"; 

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
  const { token, logout } = useAuthStore();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const productId = params.id as string;

  const fetchProduct = useCallback(async () => {
    if (!isAuthenticated || !user || user.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified' || !productId) {
      setIsLoading(false);
      return;
    }

    try {
      let headers: HeadersInit = {};
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/products/${productId}`, {
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            toast.error("Akses ditolak.", { description: "Anda tidak memiliki izin untuk mengedit produk ini atau sesi Anda berakhir." });
            logout();
            router.push('/auth/login');
            return;
        } else if (response.status === 404) {
            toast.error("Produk tidak ditemukan.", { description: "Produk yang Anda coba edit tidak ada." });
            router.replace('/umkm/products'); 
            return;
        }
        throw new Error((await response.json()).message || "Gagal mengambil data produk.");
      }
      const result = await response.json();
      setProduct(result);
    } catch (error) {
      toast.error("Gagal memuat data produk.", {
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
            toast.info("Anda tidak memiliki akses ke halaman ini.", { description: "Hanya UMKM owner yang dapat mengedit produk." });
            router.replace('/profile');
        } else if (user.umkmProfileStatus !== 'verified') {
            toast.info("Profil UMKM Anda belum diverifikasi.", { description: "Mohon tunggu persetujuan admin untuk mengakses fitur ini." });
            router.replace('/profile/pending-verification');
        }
        else {
            fetchProduct();
        }
    }
  }, [authLoading, isAuthenticated, user, productId, router, fetchProduct]);

  if (authLoading || isLoading) {
    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-[500px] w-full" /> 
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified') {
    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <div className="text-center">
                <h2 className="text-xl font-bold mb-4">Akses Ditolak</h2>
                <p className="text-muted-foreground mb-4">Anda tidak memiliki izin untuk mengakses halaman ini atau profil UMKM Anda belum diverifikasi.</p>
                <Button asChild className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                    <Link href="/auth/login">Login / Lihat Dasbor</Link>
                </Button>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl"> 
        <Card>
            <CardHeader>
                <CardTitle>Edit Produk</CardTitle>
                <CardDescription>Perbarui detail produk Anda di bawah ini.</CardDescription>
            </CardHeader>
            <CardContent>
                {product ? (
                    <ProductForm initialData={product} />
                ) : (
                    <div className="text-center p-8 text-destructive">
                        Produk tidak ditemukan atau Anda tidak memiliki akses.
                        <Button asChild className="mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300">
                            <Link href="/umkm/products">Kembali ke Daftar Produk</Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}