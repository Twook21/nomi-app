import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNews, getArticleBySlug, getRelatedArticles } from "@/lib/newsService"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { TransformedPost } from "@/app/(public)/blogs/(sections)/PostListItem";

export async function generateStaticParams() {
  try {
    const { posts } = await getNews(1, 20); 
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

// ✅ PERBAIKAN: Update generateMetadata untuk Next.js 15
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // Await params karena sekarang Promise
  const { slug } = await params;
  const post = await getArticleBySlug(slug);

  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: [post.imageUrl],
      type: "article",
      publishedTime: post.publishedDate,
      authors: [post.author],
    },
  };
}

// ✅ PERBAIKAN: Update komponen untuk await params
export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
  // Await params karena sekarang Promise
  const { slug } = await params;
  const post = await getArticleBySlug(slug);
  
  if (!post) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(slug, 2);

  return (
    <div className="bg-[var(--background)]">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 py-6 border-b border-gray-200">
        <Link href="/blogs" className="text-nimo-yellow hover:underline font-medium text-sm">
          Kembali ke Blog
        </Link>
      </div>

      <article className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Judul dan Meta */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--nimo-dark)] mb-6">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-[var(--nimo-dark)]/70 mb-8">
            <span className="font-medium">Oleh {post.author}</span>
            <span>•</span>
            <time>{post.publishedDate}</time>
            <span>•</span>
            <span className="font-medium">Publisher: {post.publisher}</span>
          </div>

          {/* Gambar Utama */}
          {post.imageUrl && (
            <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8 shadow-lg">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 100vw"
                priority
              />
            </div>
          )}

          {/* Ringkasan */}
          <div className="bg-nimo-dark rounded-lg p-6 mb-8 shadow-sm border-l-4 border-nimo-yellow">
            <h2 className="text-lg font-bold text-[var(--nimo-light)] mb-3">Ringkasan</h2>
            <p className="text-[var(--nimo-light)]/80 leading-relaxed">{post.summary}</p>
          </div>

          {/* Tombol Baca Sumber Asli */}
          <div className="bg-nimo-dark rounded-lg p-8 shadow-sm">
            <div className="prose prose-lg max-w-none">
              <p className="text-[var(--nimo-light)]/80 leading-relaxed mb-6">
                Artikel ini bersumber dari {post.publisher}. Baca konten lengkap di situs aslinya.
              </p>
              <Link
                href={post.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-nimo-yellow text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
              >
                Baca di {post.publisher}
              </Link>
            </div>
          </div>

          {/* Artikel Terkait */}
          {relatedArticles.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-[var(--nimo-dark)] pb-4 mb-6 border-b-2 border-nimo-yellow">
                Artikel Terkait
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedArticles.map((relatedPost: TransformedPost) => (
                  <div key={relatedPost.slug} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md">
                    {/* Konten kartu artikel terkait */}
                    <div className="relative h-48">
                      <Image
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        <Link href={`/blogs/${relatedPost.slug}`} className="hover:text-nimo-yellow">
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {relatedPost.summary}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{relatedPost.author}</span>
                        <span>•</span>
                        <time>{relatedPost.publishedDate}</time>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
}