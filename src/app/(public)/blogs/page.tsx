"use client";

import React, { useState, useMemo } from "react";
import { blogPosts } from "@/lib/blogPosts";
import FeaturedPostCard from "./(sections)/FeaturedPostCard";
import PostListItem from "./(sections)/PostListItem";
import { Search, Tag, Filter, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const categories = [
    "Semua",
    ...Array.from(new Set(blogPosts.map((p) => p.category))),
  ];

  const filteredPosts = useMemo(() => {
    return blogPosts
      .filter(
        (post) => activeCategory === "Semua" || post.category === activeCategory
      )
      .filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [activeCategory, searchTerm]);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setShowFilters(false); // Close filter on mobile after selection
  };

  return (
    <div className="bg-[var(--background)] min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header - Mobile Optimized */}
        <header className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[var(--nimo-dark)] tracking-tighter leading-tight">
            NIMO Blog
          </h1>
          <p className="mt-2 text-base sm:text-lg text-[var(--nimo-dark)]/70 leading-relaxed">
            Wawasan, berita, dan cerita seputar dunia pangan dan keberlanjutan.
            <br className="hidden sm:block" />
            <span className="text-nimo-yellow block sm:inline mt-1 sm:mt-0">
              *Note : Artikel ini hanya sebagai contoh dan tidak mengandung konten asli.
            </span>
          </p>
        </header>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--nimo-gray)] border border-gray-200 rounded-lg focus:ring-2 focus:ring-nimo-yellow focus:outline-none text-base"
            />
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center w-full sm:w-auto px-4 py-3 bg-nimo-yellow text-white rounded-lg font-semibold transition-all duration-200 hover:bg-nimo-yellow/90"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filter Kategori
            {activeCategory !== "Semua" && (
              <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                {activeCategory}
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filter Overlay */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end">
            <div className="bg-white w-full max-h-[70vh] overflow-y-auto rounded-t-2xl p-6 transform transition-transform duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--nimo-dark)]">
                  Pilih Kategori
                </h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`text-left p-4 rounded-lg transition-colors duration-200 flex items-center ${
                      activeCategory === category
                        ? "bg-nimo-yellow text-white font-semibold"
                        : "hover:bg-nimo-yellow/10 hover:text-nimo-yellow"
                    }`}
                  >
                    <Tag className="h-5 w-5 mr-3" />
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Content Column */}
          <main className="lg:col-span-8">
            {/* Featured Post */}
            {featuredPost && (
              <section className="mb-8 sm:mb-12">
                <FeaturedPostCard post={featuredPost} />
              </section>
            )}

            {/* Other Articles */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--nimo-dark)] pb-3 sm:pb-4 mb-6 border-b-2 border-nimo-yellow">
                Artikel Terbaru
              </h2>
              <div className="space-y-6 sm:space-y-8">
                {otherPosts.length > 0 ? (
                  otherPosts.map((post) => (
                    <PostListItem key={post.slug} post={post} />
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">📝</div>
                    <p className="text-lg mb-2">
                      {filteredPosts.length > 0
                        ? "Tidak ada artikel lain."
                        : "Artikel tidak ditemukan."}
                    </p>
                    {searchTerm && (
                      <p className="text-sm text-gray-400">
                        Coba kata kunci yang berbeda
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>
          </main>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-4 lg:sticky lg:top-8 h-fit">
            <div className="space-y-8">
              {/* Search Widget */}
              <div>
                <h3 className="text-lg font-bold text-[var(--nimo-dark)] mb-4">
                  Cari Artikel
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ketik di sini..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[var(--nimo-gray)] border border-gray-200 rounded-lg focus:ring-2 focus:ring-nimo-yellow focus:outline-none"
                  />
                </div>
              </div>

              {/* Categories Widget */}
              <div>
                <h3 className="text-lg font-bold text-[var(--nimo-dark)] mb-4">
                  Kategori
                </h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category}>
                      <button
                        onClick={() => setActiveCategory(category)}
                        className={`w-full text-left p-3 rounded-lg transition-colors duration-200 flex items-center ${
                          activeCategory === category
                            ? "bg-nimo-yellow text-white font-semibold"
                            : "hover:bg-nimo-yellow/10 hover:text-nimo-yellow"
                        }`}
                      >
                        <Tag className="h-4 w-4 mr-3" />
                        {category}
                      </button>
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
};

export default BlogPage;