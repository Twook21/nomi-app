import type { Product } from "@/types/product";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Clock, PackageCheck, Store } from "lucide-react";
import type { Metadata, ResolvingMetadata } from 'next';
import { AddToCartWidget } from "@/components/products/AddToCartWidget";
import { ProductImage } from "@/components/products/ProductImage";
import { ProductCard } from "@/components/products/ProductCard";
import { ProductReviews } from "@/components/products/ProductReviews";

export const dynamic = 'force-dynamic';

type Props = {
  params: { id: string }
}

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

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const paramsData = await params;
  const { product } = await getProductData(paramsData.id);

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

export default async function ProductDetailPage({ params }: Props) {
  const paramsData = await params;
  const { product, otherProducts } = await getProductData(paramsData.id);

  if (!product) {
    notFound();
  }
  
  const discountPercentage = Math.round(
    ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
  );

  return (
    // PERBAIKAN: Gunakan padding vertikal yang lebih kecil untuk mobile
    <div className="container mx-auto max-w-5xl py-6 md:py-10 px-4">
      {/* PERBAIKAN: Grid default 1 kolom, jadi gambar di atas info produk */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-10">
        {/* Kolom Gambar */}
        <div className="w-full">
          <div className="relative aspect-square rounded-xl overflow-hidden border bg-gray-50 dark:bg-gray-800">
            <ProductImage src={product.imageUrl} alt={product.productName} />
            {discountPercentage > 0 && (
              <Badge
                variant="default"
                className="absolute top-2 right-2 md:top-4 md:right-4 bg-nimo-yellow text-white font-medium text-xs md:text-sm"
              >
                Diskon {discountPercentage}%
              </Badge>
            )}
          </div>
        </div>

        {/* Kolom Informasi Produk */}
        <div className="flex flex-col space-y-4 md:space-y-6">
          {/* PERBAIKAN: Ukuran font judul lebih kecil di mobile */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">{product.productName}</h1>
          
          {/* PERBAIKAN: Ukuran font info toko lebih kecil di mobile */}
          <div className="flex items-center gap-2 text-base md:text-lg text-muted-foreground">
            <Store className="w-4 h-4 md:w-5 md:h-5" />
            <span className="font-medium">oleh <span className="text-foreground">{product.umkmOwner.umkmName}</span></span>
          </div>
          
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
              <PackageCheck className="w-4 h-4 md:w-5 md:h-5"/>
              <span className="font-medium">Stok: {product.stock}</span>
            </div>
            <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
              <Clock className="w-4 h-4 md:w-5 md:h-5"/>
              <span className="font-medium">Kedaluwarsa: {formatDate(product.expirationDate)}</span>
            </div>
          </div>
          
          <div className="pt-4 md:pt-6">
            <div className="flex items-baseline gap-2 md:gap-4 mb-4">
              {/* PERBAIKAN: Ukuran font harga lebih kecil di mobile */}
              <p className="text-3xl sm:text-4xl font-bold text-nimo-yellow">
                {formatRupiah(product.discountedPrice)}
              </p>
              {discountPercentage > 0 && (
                <p className="text-sm md:text-lg text-muted-foreground line-through">
                  {formatRupiah(product.originalPrice)}
                </p>
              )}
            </div>
            <AddToCartWidget productId={product.id} stock={product.stock} />
          </div>
        </div>
      </div>

      {/* Bagian Ulasan Produk */}
      {/* PERBAIKAN: Jarak antar bagian lebih kecil di mobile */}
      <div className="mt-12 md:mt-20">
        <ProductReviews reviews={product.reviews || []} />
      </div>

      {/* Bagian Produk Lain dari Toko Ini */}
      {otherProducts.length > 0 && (
        <div className="mt-12 md:mt-20">
          {/* PERBAIKAN: Ukuran font judul dan margin lebih kecil di mobile */}
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-8">Produk Lain dari {product.umkmOwner.umkmName}</h2>
          {/* PERBAIKAN: Grid hanya 2 kolom di mobile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {otherProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}