export interface AdminUmkmDetail {
  id: string;
  umkmName: string;
  umkmDescription: string;
  umkmAddress: string;
  umkmPhoneNumber: string;
  umkmEmail: string;
  isVerified: boolean;
  createdAt: string;
  user: {
    username: string;
    email: string;
    createdAt: string;
  };
  products: {
    id: string;
    productName: string;
    stock: number;
    isAvailable: boolean;
    totalSold: number;
    averageRating: number;
  }[];
  stats: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    averageDailyRevenue: number;
    averageDailyOrders: number;
    foodSaved: number;
  };
  monthlyTurnover: { month: string; omset: number }[];
  bestSeller: { productName: string; totalSold: number } | null;
  recentOrders: { id: string; totalAmount: number; customer: { username: string } }[];
}