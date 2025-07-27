// File: components/products/ProductCard.tsx

"use client";

import type { Product } from "@/types/product";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star, PackageCheck } from "lucide-react"; // [MODIFIKASI] Tambahkan ikon

interface ProductCardProps {
  product: Product;
}

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage =
    product.originalPrice > 0
      ? Math.round(
          ((product.originalPrice - product.discountedPrice) /
            product.originalPrice) *
            100
        )
      : 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block w-full h-full"
    >
      <Card className="overflow-hidden h-full transition-all duration-300 bg-[var(--nimo-light)] dark:bg-card border-border/50 hover:shadow-md">
        <CardHeader className="p-0 relative">
          <Image
            src={
              product.imageUrl ||
              "https://placehold.co/600x400/FBBF24/1E1E1E?text=Nomi"
            }
            alt={product.productName}
            width={400}
            height={300}
            className="object-cover w-full aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x400/FBBF24/1E1E1E?text=Nomi";
            }}
          />
          {discountPercentage > 0 && (
            <Badge className="absolute top-3 left-3 text-xs font-semibold bg-destructive/90 text-destructive-foreground border-0">
              Diskon {discountPercentage}%
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-3 flex flex-col">
          {/* [MODIFIKASI] Area informasi rating & terjual */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 h-4">
            {product.averageRating > 0 ? (
              <>
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span className="font-semibold text-foreground">
                  {product.averageRating.toFixed(1)}
                </span>
                {product.totalSold > 0 && (
                  <span className="text-gray-400">|</span>
                )}
              </>
            ) : (
              // ✨ UI Improvement: Tampilkan ini jika belum ada rating
              <span className="text-gray-400 italic">Belum ada penilaian</span>
            )}

            {product.totalSold > 0 && (
              <span className="flex items-center gap-1">
                <span>{product.totalSold} terjual</span>
              </span>
            )}
          </div>

          {/* Wrapper untuk konten utama agar tombol bisa didorong ke bawah */}
          <div className="flex-grow">
            <h3 className="font-bold text-base truncate text-[var(--nimo-dark)] uppercase">
              {product.productName}
            </h3>
            <p className="text-sm text-muted-foreground mb-3 truncate">
              {product.umkmOwner.umkmName}
            </p>
          </div>

          {/* Harga */}
          <div>
            {product.originalPrice > product.discountedPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {formatRupiah(product.originalPrice)}
              </p>
            )}
            <p className="text-base font-bold text-destructive">
              {formatRupiah(product.discountedPrice)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
