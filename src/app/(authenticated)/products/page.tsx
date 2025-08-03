import { ProductCard } from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/products/ProductCardSkeleton";
import type { Product } from "@/types/product";
import { Suspense } from "react";
import { Metadata } from "next";
import { ProductSearch } from "@/components/products/ProductSearch";

export const dynamic = "force-dynamic";

interface ProductsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const category = searchParams.category as string | undefined;
  const title = category
    ? `Kategori: ${category
        .replace("-", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())}`
    : "Semua Produk";
  return { title };
}

async function FilteredProductList({
  category,
  search,
}: {
  category?: string;
  search?: string;
}) {
  const params = new URLSearchParams();
  params.append("isAvailable", "true");
  if (category) params.append("category", category);
  if (search) params.append("search", search);
  const queryString = params.toString();
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/products?${queryString}`;

  try {
    const response = await fetch(apiUrl, { next: { revalidate: 60 } });
    if (!response.ok) {
      throw new Error(
        `Gagal mengambil data produk. Status: ${response.status}`
      );
    }

    const result = await response.json();
    const products: Product[] = result.products || [];

    if (products.length === 0) {
      return (
        <div className="col-span-full text-center py-8 md:py-16">
          <p className="text-lg md:text-xl font-semibold text-[var(--nimo-dark)]">
            Oops! Tidak ada produk ditemukan.
          </p>
          <p className="text-sm md:text-base text-muted-foreground mt-2">
            Coba gunakan kata kunci lain atau periksa kategori lainnya.
          </p>
        </div>
      );
    }

    return (
      <>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </>
    );
  } catch (error) {
    return (
      <div className="col-span-full text-center text-destructive bg-destructive/10 p-4 rounded-md">
        <p className="font-bold">Terjadi kesalahan saat memuat produk!</p>
        <p>
          {error instanceof Error
            ? error.message
            : "Tidak dapat terhubung ke server."}
        </p>
      </div>
    );
  }
}

function LoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </>
  );
}

export default function ProductsPage({ searchParams }: ProductsPageProps) {
  const category = searchParams.category as string | undefined;
  const search = searchParams.search as string | undefined;
  const pageTitle = category
    ? `Kategori: ${category
        .replace("-", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())}`
    : "Semua Produk Tersedia";

  return (
    <div className="bg-[var(--nimo-gray)] dark:bg-background min-h-screen">
      {/* PERBAIKAN: Gunakan padding vertikal yang lebih kecil untuk mobile */}
      <div className="container mx-auto py-6 md:py-8 px-4">
        <section>
          {/* Header Section */}
          <div
            className="text-center bg-[var(--nimo-light)] dark:bg-card p-6 md:p-8 rounded-lg shadow-sm mb-6 md:mb-8 lazy-bg"
            style={{
              backgroundImage: `url(images/bg-header.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {/* PERBAIKAN: Gunakan ukuran font yang responsif */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
              {pageTitle}
            </h1>
            {/* PERBAIKAN: Gunakan ukuran font yang responsif */}
            <p className="text-sm md:text-base text-white mt-2 mb-4 md:mb-6 max-w-2xl mx-auto">
              {search
                ? `Menampilkan hasil untuk pencarian "${search}"`
                : category
                ? `Menampilkan semua produk dalam kategori pilihan Anda.`
                : `Jelajahi semua penawaran terbaik yang tersedia saat ini.`}
            </p>
            {/* PERBAIKAN: Pastikan ProductSearch di tengah */}
            <div className="flex justify-center">
              <ProductSearch />
            </div>
          </div>
          {/* Product Grid Section */}
          <Suspense
            fallback={
              // PERBAIKAN: Grid hanya 1 kolom untuk mobile, 2 untuk sm, dst.
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                <LoadingSkeleton />
              </div>
            }
          >
            {/* PERBAIKAN: Grid hanya 1 kolom untuk mobile, 2 untuk sm, dst. */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              <FilteredProductList category={category} search={search} />
            </div>
          </Suspense>
        </section>
      </div>
    </div>
  );
}