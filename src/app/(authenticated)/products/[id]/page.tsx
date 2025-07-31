// File: app/products/[id]/page.tsx

import type { Product } from "@/types/product";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Clock, PackageCheck, Store } from "lucide-react";
import type { Metadata, ResolvingMetadata } from 'next';
import { AddToCartWidget } from "@/components/products/AddToCartWidget";
import { ProductImage } from "@/components/products/ProductImage";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductReviews } from "@/components/products/ProductReviews"; // [MODIFIKASI] Impor komponen ulasan

export const dynamic = 'force-dynamic';

type Props = {
  params: { id: string }
}

// Fungsi untuk mengambil data produk tunggal dan produk lainnya
async function getProductData(id: string): Promise<{ product: Product | null; otherProducts: Product[] }> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      return { product: null, otherProducts: [] };
    }
    
    const result = await response.json();
    return { product: result.product, otherProducts: result.otherProducts };

  } catch (error) {
    console.error(error);
    return { product: null, otherProducts: [] };
  }
}

// Fungsi untuk generate metadata dinamis (baik untuk SEO)
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { product } = await getProductData(params.id);

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan'
    }
  }
  
  return {
    title: `${product.productName} oleh ${product.umkmOwner.umkmName}`,
    description: product.description,
  }
}

// Fungsi helper
function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("id-ID", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Komponen Halaman Detail Produk
export default async function ProductDetailPage({ params }: Props) {
  const { product, otherProducts } = await getProductData(params.id);

  if (!product) {
    notFound();
  }
  
  const discountPercentage = Math.round(
    ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
  );

  return (
    <div className="container mx-auto max-w-5xl py-10 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Kolom Gambar */}
        <div className="w-full">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            <ProductImage src={product.imageUrl} alt={product.productName} />
            {discountPercentage > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-3 right-3 text-base"
              >
                {discountPercentage}% OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Kolom Informasi Produk */}
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">{product.productName}</h1>
          
          <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-muted-foreground" />
              <span className="text-lg text-muted-foreground">oleh <span className="font-semibold text-primary">{product.umkmOwner.umkmName}</span></span>
          </div>
          
          <p className="text-muted-foreground text-base leading-relaxed">
            {product.description}
          </p>

          <div className="!mt-6 space-y-2">
            <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-green-600"/>
                <span className="font-medium">Stok Tersedia: {product.stock}</span>
            </div>
            <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600"/>
                <span className="font-medium">Kedaluwarsa: {formatDate(product.expirationDate)}</span>
            </div>
          </div>
          
          <div className="!mt-8 pt-6 border-t">
            <div className="flex items-baseline gap-4 mb-4">
              <p className="text-4xl font-bold text-green-700">
                {formatRupiah(product.discountedPrice)}
              </p>
              {discountPercentage > 0 && (
                <p className="text-xl text-muted-foreground line-through">
                  {formatRupiah(product.originalPrice)}
                </p>
              )}
            </div>
            <AddToCartWidget productId={product.id} stock={product.stock} />
          </div>
        </div>
      </div>

      {/* [MODIFIKASI] Bagian untuk menampilkan ulasan produk */}
      <div className="mt-16">
        <ProductReviews reviews={product.reviews || []} />
      </div>

      {/* Bagian Produk Lain dari Toko Ini */}
      {otherProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Produk Lain dari {product.umkmOwner.umkmName}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {otherProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}