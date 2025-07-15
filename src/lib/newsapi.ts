// lib/newsapi.ts
import { NewsAPIResponse, NewsAPIParams, FoodWasteNewsResult, PaginationInfo } from '@/types/newsapi';

export class NewsAPIClient {
  private apiKey: string;
  private baseURL: string = 'https://newsapi.org/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private buildURL(endpoint: string, params: NewsAPIParams): string {
    const url = new URL(`${this.baseURL}/${endpoint}`);
    
    // Add API key
    url.searchParams.append('apiKey', this.apiKey);
    
    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
    
    return url.toString();
  }

  private calculatePagination(
    totalResults: number,
    currentPage: number,
    pageSize: number
  ): PaginationInfo {
    const totalPages = Math.ceil(totalResults / pageSize);
    
    return {
      currentPage,
      totalPages,
      totalResults,
      pageSize,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }

  async fetchNews(params: NewsAPIParams): Promise<NewsAPIResponse> {
    try {
      const url = this.buildURL('everything', params);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NewsAPIResponse = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Unknown API error');
      }

      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      throw error;
    }
  }

  async getFoodWasteNews(
    page: number = 1,
    pageSize: number = 20,
    additionalParams?: Partial<NewsAPIParams>
  ): Promise<FoodWasteNewsResult> {
    try {
      // Food waste related keywords
      const foodWasteQuery = 'food waste OR food wastage OR food loss OR food sustainability OR food security';
      
      const params: NewsAPIParams = {
        q: foodWasteQuery,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: Math.min(pageSize, 100), // NewsAPI max is 100
        page,
        ...additionalParams
      };

      const response = await this.fetchNews(params);
      
      const pagination = this.calculatePagination(
        response.totalResults,
        page,
        pageSize
      );

      return {
        articles: response.articles,
        pagination,
        status: 'ok'
      };
    } catch (error) {
      console.error('Error fetching food waste news:', error);
      return {
        articles: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalResults: 0,
          pageSize,
          hasNextPage: false,
          hasPreviousPage: false
        },
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async searchFoodWasteNews(
    searchQuery: string,
    page: number = 1,
    pageSize: number = 20,
    additionalParams?: Partial<NewsAPIParams>
  ): Promise<FoodWasteNewsResult> {
    try {
      // Combine search query with food waste context
      const combinedQuery = `${searchQuery} AND (food waste OR food wastage OR food loss OR sustainability)`;
      
      const params: NewsAPIParams = {
        q: combinedQuery,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: Math.min(pageSize, 100),
        page,
        ...additionalParams
      };

      const response = await this.fetchNews(params);
      
      const pagination = this.calculatePagination(
        response.totalResults,
        page,
        pageSize
      );

      return {
        articles: response.articles,
        pagination,
        status: 'ok'
      };
    } catch (error) {
      console.error('Error searching food waste news:', error);
      return {
        articles: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalResults: 0,
          pageSize,
          hasNextPage: false,
          hasPreviousPage: false
        },
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getFoodWasteNewsByDateRange(
    from: string,
    to: string,
    page: number = 1,
    pageSize: number = 20,
    additionalParams?: Partial<NewsAPIParams>
  ): Promise<FoodWasteNewsResult> {
    try {
      const foodWasteQuery = 'food waste OR food wastage OR food loss OR food sustainability';
      
      const params: NewsAPIParams = {
        q: foodWasteQuery,
        from,
        to,
        language: 'en',
        sortBy: 'publishedAt',
        pageSize: Math.min(pageSize, 100),
        page,
        ...additionalParams
      };

      const response = await this.fetchNews(params);
      
      const pagination = this.calculatePagination(
        response.totalResults,
        page,
        pageSize
      );

      return {
        articles: response.articles,
        pagination,
        status: 'ok'
      };
    } catch (error) {
      console.error('Error fetching food waste news by date range:', error);
      return {
        articles: [],
        pagination: {
          currentPage: page,
          totalPages: 0,
          totalResults: 0,
          pageSize,
          hasNextPage: false,
          hasPreviousPage: false
        },
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Helper function to format date for NewsAPI
export function formatDateForAPI(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Helper function to get date range for common periods
export function getDateRange(period: 'today' | 'week' | 'month' | 'year'): { from: string; to: string } {
  const today = new Date();
  const to = formatDateForAPI(today);
  
  let from: string;
  
  switch (period) {
    case 'today':
      from = to;
      break;
    case 'week':
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      from = formatDateForAPI(weekAgo);
      break;
    case 'month':
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      from = formatDateForAPI(monthAgo);
      break;
    case 'year':
      const yearAgo = new Date(today);
      yearAgo.setFullYear(yearAgo.getFullYear() - 1);
      from = formatDateForAPI(yearAgo);
      break;
    default:
      from = to;
  }
  
  return { from, to };
}