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

// Interface untuk pagination
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

const PostListItem: React.FC<{ post: TransformedPost }> = ({ post }) => {
  return (
    <article className="flex items-center gap-6 group">
      <div className="flex-shrink-0 w-48 h-32 relative rounded-lg overflow-hidden">
        <Link href={`/blogs/${post.slug}`}>
          {post.imageUrl ? (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 192px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-sm">No Image</span>
            </div>
          )}
        </Link>
      </div>
      <div className="flex-grow">
        <Link
          href={`/blogs?category=${encodeURIComponent(post.category)}`}
          className="text-sm font-bold text-nimo-yellow uppercase hover:underline"
        >
          {post.category}
        </Link>
        <h2 className="text-xl font-bold text-[var(--nimo-dark)] mt-1 leading-tight">
          <Link
            href={`/blogs/${post.slug}`}
            className="hover:text-nimo-yellow transition-colors duration-300"
          >
            {post.title}
          </Link>
        </h2>
        
        {/* Summary */}
        <p className="text-sm text-[var(--nimo-dark)]/70 mt-2 line-clamp-2">
          {post.summary}
        </p>

        <div className="mt-3 flex items-center gap-4 text-sm text-[var(--nimo-dark)]/60">
          <span>Oleh {post.author}</span>
          <span>•</span>
          <span>{post.publishedDate}</span>
          <span>•</span>
          <span>{post.publisher}</span>
        </div>

        {/* Stock Tickers */}
        {post.tickers && post.tickers.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {post.tickers.slice(0, 3).map((ticker, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-md"
              >
                {ticker}
              </span>
            ))}
            {post.tickers.length > 3 && (
              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md">
                +{post.tickers.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Sentiment Badge */}
        {post.sentiment && post.sentiment !== 'neutral' && (
          <div className="mt-2">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
              post.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
              post.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {post.sentiment}
            </span>
          </div>
        )}
      </div>
    </article>
  );
};

// Komponen Pagination
const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  hasNext, 
  hasPrev, 
  onPageChange 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-8 space-x-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={`px-4 py-2 rounded-lg border transition-colors ${
          hasPrev 
            ? 'bg-white text-[var(--nimo-dark)] border-gray-300 hover:bg-gray-50' 
            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
        }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                currentPage === page
                  ? 'bg-nimo-yellow text-white border-nimo-yellow'
                  : 'bg-white text-[var(--nimo-dark)] border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className={`px-4 py-2 rounded-lg border transition-colors ${
          hasNext 
            ? 'bg-white text-[var(--nimo-dark)] border-gray-300 hover:bg-gray-50' 
            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
        }`}
      >
        Next
      </button>
    </div>
  );
};

// Komponen utama untuk menampilkan daftar post dengan pagination
interface PostListProps {
  posts: TransformedPost[];
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

const PostList: React.FC<PostListProps> = ({ 
  posts, 
  currentPage, 
  totalPages, 
  hasNext, 
  hasPrev, 
  onPageChange 
}) => {
  return (
    <div className="space-y-8">
      {/* Post List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrev={hasPrev}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default PostList;
export { PostListItem, Pagination, type TransformedPost, type PaginationProps };