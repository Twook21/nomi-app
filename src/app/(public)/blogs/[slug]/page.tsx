import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Post, blogPosts } from "@/lib/blogPosts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Generate static params for all blog posts
export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = blogPosts.find((p) => p.slug === params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

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

// Main component - PASTIKAN INI ADA DEFAULT EXPORT
export default function BlogDetail({ params }: { params: { slug: string } }) {
  console.log("🔍 Slug from params:", params.slug);
  console.log("📚 Available slugs:", blogPosts.map(p => p.slug));
  
  const post = blogPosts.find((p) => p.slug === params.slug);
  console.log("📰 Found post:", post ? post.title : "Not found");

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[var(--background)]">
      <Navbar />

      {/* Navigation breadcrumb */}
      <div className="container mx-auto px-4 sm:px-6 py-6 border-b border-gray-200">
        <Link 
          href="/blogs" 
          className="text-nimo-yellow hover:underline font-medium text-sm"
        >
           Kembali ke Blog
        </Link>
      </div>

      {/* Article Content */}
      <article className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Category Badge */}
          <div className="mb-6">
            <Link
              href={`/blogs?category=${encodeURIComponent(post.category)}`}
              className="inline-block px-4 py-2 bg-nimo-yellow text-white text-sm font-bold uppercase rounded-lg hover:bg-yellow-600 transition-colors"
            >
              {post.category}
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--nimo-dark)] mb-6 leading-tight tracking-tighter">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-[var(--nimo-dark)]/70 mb-8">
            <span className="font-medium">Oleh {post.author}</span>
            <span>•</span>
            <time>{post.publishedDate}</time>
          </div>

          {/* Featured Image */}
          <div className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden mb-8 shadow-lg">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              priority
            />
          </div>

          {/* Article Summary */}
          <div className="bg-nimo-dark rounded-lg p-6 mb-8 shadow-sm border-l-4 border-nimo-yellow">
            <h2 className="text-lg font-bold text-[var(--nimo-light)] mb-3">
              Ringkasan
            </h2>
            <p className="text-[var(--nimo-light)]/80 leading-relaxed">
              {post.summary}
            </p>
          </div>

          {/* Article Content Placeholder */}
          <div className="bg-nimo-dark rounded-lg p-8 shadow-sm">
            <div className="prose prose-lg max-w-none">
              <p className="text-[var(--nimo-light)]/80 leading-relaxed mb-6">
                Artikel ini membahas tentang {post.title.toLowerCase()}. Konten lengkap 
                artikel dapat dibaca di sumber aslinya.
              </p>
              
              <div className="bg-[var(--nimo-gray)] rounded-lg p-6 my-8">
                <h3 className="text-lg font-bold text-[var(--nimo-dark)] mb-3">
                  Baca Artikel Lengkap
                </h3>
                <p className="text-[var(--nimo-dark)]/70 mb-4">
                  Untuk membaca artikel lengkap, silakan kunjungi sumber asli:
                </p>
                <Link
                  href={post.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-nimo-yellow text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                >
                  Baca di {post.author}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[var(--nimo-dark)] pb-4 mb-6 border-b-2 border-nimo-yellow">
              Artikel Terkait
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {blogPosts
                .filter(p => p.slug !== post.slug && p.category === post.category)
                .slice(0, 2)
                .map((relatedPost) => (
                  <div key={relatedPost.slug} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <Image
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                      />
                    </div>
                    <div className="p-4">
                      <Link
                        href={`/blogs?category=${encodeURIComponent(relatedPost.category)}`}
                        className="text-sm font-bold text-nimo-yellow uppercase hover:underline"
                      >
                        {relatedPost.category}
                      </Link>
                      <h3 className="font-semibold text-[var(--nimo-dark)] mt-2 mb-2 line-clamp-2">
                        <Link
                          href={`/blogs/${relatedPost.slug}`}
                          className="hover:text-nimo-yellow transition-colors"
                        >
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <div className="text-sm text-[var(--nimo-dark)]/70">
                        <span>{relatedPost.author}</span>
                        <span className="mx-2">•</span>
                        <span>{relatedPost.publishedDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}