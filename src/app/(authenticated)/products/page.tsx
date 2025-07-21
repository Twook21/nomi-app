/*
================================================================================
File: src/app/(app)/products/page.tsx (FIXED)
Description: Halaman untuk menampilkan daftar produk. Bisa menampilkan semua
produk atau produk yang difilter berdasarkan kategori dari URL.
================================================================================
*/
import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import type { Product } from "@/types/product";
import { Suspense } from "react";
import { Metadata } from "next";

// Menambahkan baris ini untuk memberitahu Next.js bahwa halaman ini dinamis
export const dynamic = 'force-dynamic';

// Tipe props untuk halaman yang menggunakan searchParams
interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

// Fungsi untuk generate metadata dinamis
export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const category = searchParams.category as string | undefined;
  const title = category 
    ? `Produk Kategori: ${category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`
    : 'Semua Produk';
  
  return { title };
}

// Komponen Asinkron untuk Fetching Data Produk
async function FilteredProductList({ category }: { category?: string }) {
  // 1. Bangun URL API secara dinamis
  let apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products`;
  if (category) {
    apiUrl += `?category=${category}`;
  }

  try {
    const response = await fetch(apiUrl, {
      next: { revalidate: 60 }, // Revalidate data setiap 60 detik
    });

    if (!response.ok) {
      throw new Error(`Gagal mengambil data produk. Server merespons dengan status ${response.status}.`);
    }

    const result = await response.json();
    // PERBAIKAN: Mengambil data dari 'result.products' sesuai dengan format API
    const products: Product[] = result.products || [];

    // 2. Tampilkan pesan jika tidak ada produk
    if (products.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <p className="text-xl font-semibold">Oops! Tidak ada produk ditemukan.</p>
          <p className="text-muted-foreground">
            Coba periksa kategori lain atau kembali nanti.
          </p>
        </div>
      );
    }

    // 3. Tampilkan produk jika ada
    return (
      <>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </>
    );
  } catch (error) {
    return (
      <div className="col-span-full text-center text-red-500 bg-red-50 p-4 rounded-md">
        <p className="font-bold">Terjadi kesalahan saat memuat produk!</p>
        <p>{error instanceof Error ? error.message : "Tidak dapat terhubung ke server."}</p>
      </div>
    );
  }
}

// Komponen untuk UI Loading
function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}

// Halaman Utama untuk /products
export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams.category as string | undefined;
  
  // Membuat judul yang lebih ramah pengguna dari slug kategori
  const pageTitle = category 
    ? `Kategori: ${category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}` 
    : "Semua Produk Tersedia";

  return (
    <div className="container mx-auto py-8 px-4">
      <section>
        <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
        <p className="text-muted-foreground mb-8">
          {category 
            ? `Menampilkan semua produk dalam kategori pilihan Anda.`
            : `Jelajahi semua penawaran terbaik yang tersedia saat ini.`
          }
        </p>
        
        <Suspense fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <LoadingSkeleton />
          </div>
        }>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <FilteredProductList category={category} />
          </div>
        </Suspense>
      </section>
    </div>
  );
}