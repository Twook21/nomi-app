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

// generateMetadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getArticleBySlug(params.slug);

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


export default async function BlogDetail({ params }: { params: { slug: string } }) {
  const post = await getArticleBySlug(params.slug);
  
  if (!post) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(params.slug, 2);

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
                    {/* ... (konten kartu artikel terkait, sudah cocok) ... */}
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