import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import type { Product } from "@/types/product";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";

async function ProductList() {
  try {
    // PERBAIKAN: Mengambil hanya 5 produk dari API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products?limit=5`, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error("Gagal mengambil data produk.");
    const result = await response.json();
    const products: Product[] = result.products || [];
    if (products.length === 0) return <p className="text-center w-full text-muted-foreground">Belum ada produk yang tersedia saat ini.</p>;
    
    return products.map((product) => <ProductCard key={product.id} product={product} />);
  } catch (error) {
    return (
      <div className="w-full text-center text-red-500 bg-red-50 p-4 rounded-md">
        <p className="font-bold">Oops, terjadi kesalahan!</p>
        <p>{error instanceof Error ? error.message : "Tidak dapat terhubung ke server."}</p>
      </div>
    );
  }
}

function LoadingSkeleton() {
  // Skeleton disesuaikan untuk menampilkan 5 item
  return Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />);
}

export default function Deals() {
  return (
    // PERBAIKAN: Menyesuaikan background color sesuai tema
    <section id="deals" className="py-20 bg-[var(--nimo-gray)] dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          {/* PERBAIKAN: Menggunakan warna teks dari tema */}
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">Penawaran Spesial Hari Ini!</h2>
          <p className="text-muted-foreground mt-3 text-lg">Selamatkan makanan lezat dari UMKM lokal dengan harga terbaik.</p>
        </div>
        <div className="relative">
          <Suspense fallback={
            <div className="flex space-x-6 pb-4">
              <LoadingSkeleton />
            </div>
          }>
            {/* Menggunakan flexbox untuk horizontal scroll */}
            <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 scrollbar-hide">
              <ProductList />
              {/* Card "Lihat Lebih Banyak" */}
              <div className="w-64 sm:w-72 flex-shrink-0">
                <Link href="/products" className="group h-full block">
                  <Card className="h-full flex flex-col items-center justify-center bg-[var(--nimo-light)] dark:bg-card hover:bg-accent transition-colors duration-300 ease-in-out">
                    <div className="text-center p-4">
                      <div className="bg-[var(--nimo-yellow)] text-[var(--nimo-light)] dark:text-black p-4 rounded-full inline-block group-hover:scale-110 transition-transform">
                        <ArrowRight size={32} />
                      </div>
                      <p className="mt-4 font-semibold text-lg text-[var(--nimo-dark)]">Lihat Semua</p>
                      <p className="text-sm text-muted-foreground">Penawaran Lainnya</p>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          </Suspense>
        </div>
      </div>
    </section>
  );
}
