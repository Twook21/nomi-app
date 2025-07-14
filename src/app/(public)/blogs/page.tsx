"use client";

import React, { useState, useMemo } from "react";
import { blogPosts } from "@/lib/data";
import FeaturedPostCard from "./(sections)/FeaturedPostCard";
import PostListItem from "./(sections)/PostListItem";
import { Search, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  return (
    <div className="bg-[var(--background)]">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 py-16">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-5xl font-extrabold text-[var(--nimo-dark)] tracking-tighter">
            NIMO Blog
          </h1>
          <p className="mt-2 text-lg text-[var(--nimo-dark)]/70">
            Wawasan, berita, dan cerita seputar dunia pangan dan keberlanjutan.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Kolom Konten Utama (8/12) */}
          <main className="lg:col-span-8">
            {/* Featured Post */}
            {featuredPost && (
              <section className="mb-12">
                <FeaturedPostCard post={featuredPost} />
              </section>
            )}

            {/* Daftar Artikel Lainnya */}
            <section>
              <h2 className="text-2xl font-bold text-[var(--nimo-dark)] pb-4 mb-6 border-b-2 border-nimo-yellow">
                Artikel Terbaru
              </h2>
              <div className="space-y-8">
                {otherPosts.length > 0 ? (
                  otherPosts.map((post) => (
                    <PostListItem key={post.slug} post={post} />
                  ))
                ) : (
                  <p className="text-center py-8 text-gray-500">
                    {filteredPosts.length > 0
                      ? "Tidak ada artikel lain."
                      : "Artikel tidak ditemukan."}
                  </p>
                )}
              </div>
            </section>
          </main>

          {/* Kolom Sidebar (4/12) */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
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
