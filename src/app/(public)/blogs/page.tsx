import React from "react";
import Link from "next/link";
import { Search, Tag } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedPostCard from "@/app/(public)/blogs/(sections)/FeaturedPostCard";
import PostList, {
  PostListItem,
  Pagination,
} from "@/app/(public)/blogs/(sections)/PostListItem";
import { getNews, getCategories } from "@/lib/newsService"; 

import type { TransformedPost } from "@/app/(public)/blogs/(sections)/PostListItem";

// ✅ PERBAIKAN: Update interface untuk Next.js 15
interface BlogsPageProps {
  searchParams: Promise<{
    category?: string; 
    search?: string;
    page?: string;
  }>;
}

// ✅ PERBAIKAN: Update komponen untuk await searchParams
export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  // Await searchParams karena sekarang Promise
  const resolvedSearchParams = await searchParams;
  
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const itemsPerPage = 10;

  const query = resolvedSearchParams.category || resolvedSearchParams.search;

  const { posts: allPosts, pagination } = await getNews(
    currentPage,
    itemsPerPage,
    query
  );

  const featuredPost =
    currentPage === 1 && allPosts.length > 0 ? allPosts[0] : null;
  const otherPosts = currentPage === 1 ? allPosts.slice(1) : allPosts;

  const categories = getCategories(); 

  // ✅ PERBAIKAN: Update buildUrl untuk menggunakan resolvedSearchParams
  const buildUrl = (newParams: Record<string, string | undefined>) => {
    // Buat URLSearchParams dari resolvedSearchParams
    const params = new URLSearchParams();
    
    // Tambahkan existing params
    Object.entries(resolvedSearchParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    // Hapus params yang akan diganti
    Object.keys(newParams).forEach((key) => params.delete(key));

    // Tambahkan params baru
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    // Logika mutual exclusive untuk search dan category
    if ("search" in newParams) {
      params.delete("category");
    }
    if ("category" in newParams) {
      params.delete("search");
    }

    const paramsString = params.toString();
    return `/blogs${paramsString ? "?" + paramsString : ""}`;
  };

  return (
    <div className="bg-[var(--background)] min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--nimo-dark)] tracking-tighter leading-tight">
            Food Waste & Sustainability News
          </h1>
          <p className="mt-2 text-base sm:text-lg text-[var(--nimo-dark)]/70 leading-relaxed">
            Berita terkini seputar isu sampah makanan dan keberlanjutan global.
            <br className="hidden sm:block" />
            <span className="text-nimo-yellow block sm:inline mt-1 sm:mt-0">
              *Data didukung oleh NewsAPI.org
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content Column */}
          <main className="lg:col-span-8">
            {allPosts.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg mb-2">Berita tidak ditemukan.</p>
              </div>
            ) : (
              <>
                {featuredPost && (
                  <section className="mb-8 sm:mb-12">
                    <FeaturedPostCard post={featuredPost} />
                  </section>
                )}
                {otherPosts.length > 0 && (
                  <section>
                    <h2 className="text-xl sm:text-2xl font-bold text-[var(--nimo-dark)] pb-3 sm:pb-4 mb-6 border-b-2 border-nimo-yellow">
                      {currentPage === 1
                        ? "Berita Terbaru"
                        : `Halaman ${currentPage}`}
                    </h2>
                    <PostList
                      posts={otherPosts}
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      hasNext={pagination.hasNextPage}
                      hasPrev={pagination.hasPreviousPage}
                      onPageChange={() => {}} 
                    />
                  </section>
                )}
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
            <div className="space-y-8">
              {/* Search Widget */}
              <div>
                <h3 className="text-lg font-bold text-[var(--nimo-dark)] mb-4">
                  Cari Berita
                </h3>
                <form method="GET" action="/blogs">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="search"
                      placeholder="Ketik di sini..."
                      defaultValue={resolvedSearchParams.search || ""}
                      className="w-full pl-10 pr-4 py-2.5 bg-[var(--nimo-gray)] border border-gray-200 rounded-lg"
                    />
                    <input type="hidden" name="page" value="1" />
                  </div>
                </form>
              </div>

              {/* Categories Widget */}
              <div>
                <h3 className="text-lg font-bold text-[var(--nimo-dark)] mb-4">
                  Kategori
                </h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href={buildUrl({
                        category: undefined,
                        page: "1",
                        search: undefined,
                      })}
                      className={`w-full text-left p-3 rounded-lg flex items-center ${
                        !resolvedSearchParams.category
                          ? "bg-nimo-yellow text-white"
                          : "hover:bg-nimo-yellow/10"
                      }`}
                    >
                      <Tag className="h-4 w-4 mr-3" /> Semua
                    </Link>
                  </li>
                  {categories.map((category) => (
                    <li key={category}>
                      <Link
                        href={buildUrl({
                          category,
                          page: "1",
                          search: undefined,
                        })}
                        className={`w-full text-left p-3 rounded-lg flex items-center ${
                          resolvedSearchParams.category === category
                            ? "bg-nimo-yellow text-white"
                            : "hover:bg-nimo-yellow/10"
                        }`}
                      >
                        <Tag className="h-4 w-4 mr-3" /> {category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}