/*
================================================================================
File: src/components/products/ProductCard.tsx (STYLED)
Description: Komponen kartu produk dengan styling yang disesuaikan dengan tema.
================================================================================
*/
"use client";

import type { Product } from "@/types/product";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
  // Hitung persentase diskon
  const discountPercentage = Math.round(
    ((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100
  );

  return (
    // Div wrapper untuk menjaga ukuran pada layout horizontal
    <div className="w-64 sm:w-72 flex-shrink-0">
      <Link href={`/products/${product.id}`} className="group">
        {/* PERBAIKAN: Menerapkan warna tema pada Card */}
        <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-[var(--nimo-light)] dark:bg-card border-border">
          <CardHeader className="p-0 relative">
            <Image
              src={product.imageUrl || "https://placehold.co/600x400/green/white?text=Nomi"}
              alt={product.productName}
              width={400}
              height={300}
              className="object-cover w-full h-48"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400/green/white?text=Nomi";
              }}
            />
            {discountPercentage > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute top-2 right-2 text-sm"
              >
                {discountPercentage}% OFF
              </Badge>
            )}
          </CardHeader>
          <CardContent className="p-4">
            {/* PERBAIKAN: Menerapkan warna tema pada teks */}
            <h3 className="font-semibold text-lg truncate text-[var(--nimo-dark)] group-hover:text-[var(--nimo-yellow)] transition-colors">
              {product.productName}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              oleh {product.umkmOwner.umkmName}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-nimo-yellow dark:text-nimo-yellow">
                {formatRupiah(product.discountedPrice)}
              </p>
              {discountPercentage > 0 && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatRupiah(product.originalPrice)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
