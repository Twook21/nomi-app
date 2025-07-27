export interface AdminFoodCategory {
  id: string;
  categoryName: string;
  _count: {
    products: number;
  };
}