"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import type { Product } from "@/types/product";
import { toast } from "sonner";
import { ProductForm } from "@/components/umkm/ProductForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EditProductPage() {
  const params = useParams();
  const { token } = useAuthStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const productId = params.id as string;

  useEffect(() => {
    if (!token || !productId) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/products/${productId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Gagal mengambil data produk.");
        const result = await response.json();
        setProduct(result);
      } catch (error) {
        toast.error("Gagal memuat data produk.", {
          description: error instanceof Error ? error.message : "Produk tidak ditemukan.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [token, productId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Produk</CardTitle>
        <CardDescription>Perbarui detail produk Anda di bawah ini.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center p-8 text-muted-foreground">Memuat produk...</div>
        ) : product ? (
          <ProductForm initialData={product} />
        ) : (
          <p>Produk tidak ditemukan atau Anda tidak memiliki akses.</p>
        )}
      </CardContent>
    </Card>
  );
}
