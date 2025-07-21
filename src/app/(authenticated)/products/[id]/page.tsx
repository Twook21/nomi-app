import type { Product } from "@/types/product";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Clock, PackageCheck, Store } from "lucide-react";
import type { Metadata, ResolvingMetadata } from 'next';
import { AddToCartButton } from "@/components/products/AddToCardButton";
import { ProductImage } from "@/components/products/ProductImage"; // <-- 1. Impor komponen baru

// Memberitahu Next.js bahwa halaman ini dinamis
export const dynamic = 'force-dynamic';

// Tipe props untuk halaman dinamis
type Props = {
  params: { id: string }
}

// Fungsi untuk mengambil data produk tunggal
async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products/${id}`, {
      next: { revalidate: 60 } // Cache data selama 60 detik
    });

    if (response.status === 404) {
      return null; // Produk tidak ditemukan
    }

    if (!response.ok) {
      throw new Error("Gagal mengambil data produk.");
    }
    
    const result = await response.json();
    return result.data;

  } catch (error) {
    console.error(error);
    throw new Error("Terjadi kesalahan saat menghubungi server.");
  }
}

// Fungsi untuk generate metadata dinamis (baik untuk SEO)
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const product = await getProduct(id);

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

// Fungsi untuk format mata uang Rupiah
function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Fungsi untuk format tanggal
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
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }
  
  const discountPercentage = Math.round(
    ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
  );

  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Kolom Gambar */}
        <div className="w-full">
          <div className="relative aspect-square rounded-lg overflow-hidden border">
            {/* 2. Ganti <Image> dengan komponen <ProductImage> */}
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
            <AddToCartButton productId={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
