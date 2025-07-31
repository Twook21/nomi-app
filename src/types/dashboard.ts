// types/dashboard.ts

export interface DashboardProduct {
  id: string;
  productName: string;
  description: string;
  originalPrice: string | number; // Allow both string and number
  discountedPrice: string | number; // Allow both string and number
  stock: number;
  imageUrl: string | null;
  expirationDate: string;
  isAvailable: boolean;
  categoryId: string;
  umkmOwner: {
    umkmName: string;
  };
  // Optional properties untuk dashboard
  category?: {
    categoryName: string;
  } | null;
  totalSold?: number;
  averageRating?: number;
  reviews?: any[];
}

export interface DashboardData {
  recentActiveOrder: {
    id: string;
    orderStatus: string;
    totalAmount: number;
  } | null;
  frequentlyPurchased: DashboardProduct[];
  authMethod?: 'jwt' | 'nextauth';
}