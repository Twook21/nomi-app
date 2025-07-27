export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
}

export interface OrderItem {
  id: string;
  quantity: number;
  pricePerItem: number;
  product: {
    id: string;
    productName: string;
    imageUrl: string;
    reviews: Review[];
  };
}

export interface Order {
  id: string;
  totalAmount: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  shippingAddress: string;
  createdAt: string;
  orderItems: OrderItem[];
}
