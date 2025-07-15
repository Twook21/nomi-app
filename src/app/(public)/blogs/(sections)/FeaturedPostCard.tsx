import React from "react";
import Link from "next/link";
import Image from "next/image";

// Interface untuk data yang sudah di-transform dari Polygon API
interface TransformedPost {
  id: string;
  slug: string;
  title: string;
  author: string;
  publishedDate: string;
  category: string;
  imageUrl: string;
  summary: string;
  source: string;
  publisher: string;
  tickers: string[];
  sentiment: string;
  keywords: string[];
}

const FeaturedPostCard: React.FC<{ post: TransformedPost }> = ({ post }) => {
  return (
    <article className="relative w-full h-96 rounded-2xl overflow-hidden group shadow-lg">
      {post.imageUrl && (
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-8 text-white">
        <Link
          href={`/blogs?category=${encodeURIComponent(post.category)}`}
          className="text-sm font-bold text-nimo-yellow uppercase hover:underline"
        >
          {post.category}
        </Link>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 leading-tight">
          <Link
            href={`/blogs/${post.slug}`}
            className="hover:text-nimo-yellow transition-colors duration-300"
          >
            {post.title}
          </Link>
        </h1>
        <div className="mt-4 text-sm opacity-80">
          <span>Oleh {post.author}</span>
          <span className="mx-2">•</span>
          <span>{post.publishedDate}</span>
          <span className="mx-2">•</span>
          <span>{post.publisher}</span>
        </div>
        
        {/* Stock Tickers */}
        {post.tickers && post.tickers.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {post.tickers.slice(0, 3).map((ticker, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-blue-500/80 text-white text-xs font-semibold rounded-md"
              >
                {ticker}
              </span>
            ))}
            {post.tickers.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-500/80 text-white text-xs font-semibold rounded-md">
                +{post.tickers.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Sentiment Badge */}
        {post.sentiment && post.sentiment !== 'neutral' && (
          <div className="mt-2">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              post.sentiment === 'positive' ? 'bg-green-500/80 text-white' :
              post.sentiment === 'negative' ? 'bg-red-500/80 text-white' :
              'bg-gray-500/80 text-white'
            }`}>
              {post.sentiment}
            </span>
          </div>
        )}
      </div>
    </article>
  );
};

export default FeaturedPostCard;