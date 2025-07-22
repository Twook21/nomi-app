"use client";

import type { Product } from "@/types/product";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

// Fungsi untuk format mata uang Rupiah
function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = Math.round(
    ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
  );

  return (
    <Link href={`/products/${product.id}`} className="group block w-full h-full">
      {/* PERBAIKAN: Style Card disesuaikan dengan contoh */}
      <Card className="overflow-hidden h-full transition-all duration-300 bg-[var(--nimo-light)] dark:bg-card border-border/50 hover:shadow-md">
        <CardHeader className="p-0 relative">
          <Image
            src={product.imageUrl || "https://placehold.co/600x400/FBBF24/1E1E1E?text=Nomi"}
            alt={product.productName}
            width={400}
            height={300}
            className="object-cover w-full aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/600x400/FBBF24/1E1E1E?text=Nomi";
            }}
          />
          {discountPercentage > 0 && (
            // PERBAIKAN: Style Badge disesuaikan dengan contoh (kiri atas)
            <Badge 
              className="absolute top-3 left-3 text-xs font-semibold bg-destructive/90 text-destructive-foreground border-0"
            >
              Diskon {discountPercentage}%
            </Badge>
          )}
        </CardHeader>
        <CardContent className="p-3">
          {/* PERBAIKAN: Struktur konten disesuaikan dengan contoh */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <Star className="w-3 h-3 fill-nimo-yellow text-nimo-yellow" />
            <span className="font-medium">4.8</span>
            <span>•</span>
            <span>{product.stock}+ Terjual</span>
          </div>
          <h3 className="font-bold text-base truncate text-[var(--nimo-dark)] uppercase">
            {product.productName}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            {product.umkmOwner.umkmName}
          </p>
          <p className="text-base font-bold text-[var(--nimo-dark)]">
            {formatRupiah(product.discountedPrice)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}