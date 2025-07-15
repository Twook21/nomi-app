// lib/newsService.ts
import { NewsAPIClient } from '@/lib/newsapi';
import type { NewsArticle } from '@/types/newsapi';
import type { TransformedPost } from '@/app/(public)/blogs/(sections)/PostListItem';
import { Buffer } from 'buffer'; // Import Buffer
import { cache } from 'react';

// Pastikan Anda sudah membuat file .env.local dan mengisi NEWS_API_KEY
const newsClient = new NewsAPIClient(process.env.NEWS_API_KEY || '');

/**
 * Mengubah URL artikel menjadi slug yang aman untuk URL.
 * Ini penting karena NewsAPI tidak menyediakan slug unik.
 */
function createSlugFromUrl(url: string): string {
  return Buffer.from(url).toString('base64url');
}

/**
 * Mengubah format artikel dari NewsAPI menjadi format yang digunakan oleh UI (TransformedPost).
 */
function transformArticle(article: NewsArticle): TransformedPost {
  // Format tanggal agar lebih mudah dibaca
  const publishedDate = new Date(article.publishedAt).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    id: createSlugFromUrl(article.url), // Gunakan slug sebagai ID unik
    slug: createSlugFromUrl(article.url),
    title: article.title,
    author: article.author || 'Unknown Author',
    publishedDate,
    category: 'General News', // NewsAPI tidak menyediakan kategori, jadi kita gunakan nilai default
    imageUrl: article.urlToImage || '/placeholder-image.jpg', // Sediakan gambar placeholder
    summary: article.description || 'No summary available.',
    source: article.url,
    publisher: article.source.name,
    tickers: [], // NewsAPI tidak menyediakan data ticker saham
    sentiment: 'neutral', // NewsAPI tidak menyediakan data sentimen
    keywords: [], // NewsAPI tidak menyediakan data keyword
  };
}

/**
 * Mengambil berita dengan paginasi dan fungsionalitas pencarian.
 * Menggunakan React.cache untuk menghindari fetch berulang dengan parameter yang sama.
 */
export const getNews = cache(async (
  page: number, 
  pageSize: number, 
  query?: string
) => {
  try {
    const result = query
      ? await newsClient.searchFoodWasteNews(query, page, pageSize)
      : await newsClient.getFoodWasteNews(page, pageSize);

    if (result.status === 'error') {
      throw new Error(result.message || 'Failed to fetch news');
    }

    const transformedPosts = result.articles.map(transformArticle);

    return {
      posts: transformedPosts,
      pagination: result.pagination,
    };
  } catch (error) {
    console.error("Error fetching news from service:", error);
    return {
      posts: [],
      pagination: { currentPage: page, totalPages: 0, totalResults: 0, pageSize, hasNextPage: false, hasPreviousPage: false },
    };
  }
});


/**
 * Mencari satu artikel berdasarkan slug-nya.
 * Karena NewsAPI tidak bisa fetch by ID/slug, kita fetch daftar berita
 * lalu mencari artikel yang cocok.
 */
export const getArticleBySlug = cache(async (slug: string): Promise<TransformedPost | null> => {
  console.log(`Searching for slug: ${slug}`);
  // Fetch dari beberapa halaman untuk probabilitas menemukan artikel lebih tinggi
  for (let i = 1; i <= 5; i++) {
    const { posts } = await getNews(i, 100); // Fetch 100 item per halaman
    const found = posts.find(p => p.slug === slug);
    if (found) {
      console.log(`Article found: ${found.title}`);
      return found;
    }
  }
  console.log(`Article with slug "${slug}" not found after checking 500 articles.`);
  return null;
});

/**
 * Mendapatkan artikel terkait (berita terbaru lainnya).
 */
export const getRelatedArticles = cache(async (currentSlug: string, count: number): Promise<TransformedPost[]> => {
  const { posts } = await getNews(1, count + 5); // Ambil lebih banyak untuk cadangan
  return posts
    .filter(p => p.slug !== currentSlug) // Jangan tampilkan artikel yang sedang dibaca
    .slice(0, count); // Ambil sejumlah yang dibutuhkan
});

/**
 * Mendapatkan daftar kategori unik (simulasi, karena API tidak menyediakan).
 * Kita bisa definisikan beberapa kategori populer secara manual.
 */
export const getCategories = (): string[] => {
    // Ini adalah kategori statis karena NewsAPI tidak menyediakannya.
    // Anda bisa mengisinya dengan topik umum yang relevan.
    return ['Business', 'Technology', 'Health', 'Science', 'Entertainment'];
};