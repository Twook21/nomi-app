export interface UmkmOrder {
  id: string;
  totalAmount: number;
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string; // Ditambahkan untuk halaman detail
  customer: {
    name: string;
    username: string;
    email: string;
    phoneNumber: string; // Ditambahkan untuk halaman detail
  };
  orderItems: {
    id: string;
    quantity: number;
    pricePerItem: number;
    product: {
      id: string;
      productName: string;
      imageUrl: string;
    };
  }[];
}