import type { Product } from "./product";

// Tipe untuk satu item di dalam keranjang
export interface CartItem {
  id: string;
  quantity: number;
  product: Pick<Product, 'id' | 'productName' | 'discountedPrice' | 'imageUrl' | 'stock'>;
}

// Tipe untuk keseluruhan objek keranjang yang diterima dari API
export interface Cart {
  id: string;
  customerId: string; // Sesuai dengan skema prisma Anda
  cartItems: CartItem[]; // Menggunakan cartItems agar cocok dengan API
  // totalPrice akan kita hitung di frontend untuk fleksibilitas
}