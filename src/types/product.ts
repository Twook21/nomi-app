export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    customer: {
        username: string;
        name?: string;
        image?: string;
    };
}

export interface Product {
  id: string;
  productName: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  stock: number;
  imageUrl: string | null;
  expirationDate: string;
  isAvailable: boolean;
  umkmOwner: {
    umkmName: string;
  };
  category: {
    categoryName: string;
  } | null;
  categoryId: string;
  // PERBAIKAN: Menambahkan properti analitik yang hilang
  totalSold: number;
  averageRating: number;
  reviews: Review[];
}