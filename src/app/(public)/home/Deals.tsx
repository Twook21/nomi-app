import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import type { Product } from "@/types/product";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

async function ProductList() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/products?limit=5`, { 
      next: { revalidate: 60 } 
    });
    if (!response.ok) throw new Error("Gagal mengambil data produk.");
    
    const result = await response.json();
    const products: Product[] = result.products || [];
    
    if (products.length === 0) {
      return <p className="text-gray-500">Belum ada produk</p>;
    }
    
    return products.map((product) => <ProductCard key={product.id} product={product} />);
  } catch (error) {
    return (
      <div className="text-red-500 p-4">
        <p>Gagal memuat produk</p>
      </div>
    );
  }
}

function LoadingSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => <ProductCardSkeleton key={i} />);
}

export default function Deals() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Penawaran Hari Ini
            </h2>
            <p className="text-md text-gray-500 mt-1">
              Produk pilihan dengan harga terbaik
            </p>
          </div>
          
          <Link 
            href="/products" 
            className="text-md text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white flex items-center gap-1 transition-colors"
          >
            Lihat Semua
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Product List */}
        <Suspense fallback={
          <div className="flex gap-4 overflow-x-auto">
            <LoadingSkeleton />
          </div>
        }>
          <div className="flex gap-4 overflow-x-auto">
            <ProductList />
          </div>
        </Suspense>
      </div>
    </section>
  );
}