export interface OrderItem {
  id: string;
  quantity: number;
  pricePerItem: number; // PERBAIKAN: Menggunakan nama properti yang benar dari API
  product: {
    id: string;
    productName: string;
    imageUrl: string;
  };
}

export interface Order {
  id: string;
  totalAmount: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: string;
  createdAt: string;
  orderItems: OrderItem[];
}