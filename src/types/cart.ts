import type { Product } from "./product";

export interface CartItem {
  id: string;
  quantity: number;
  product: Pick<Product, 'id' | 'productName' | 'discountedPrice' | 'imageUrl' | 'stock'>;
}

export interface Cart {
  id: string;
  customerId: string;
  cartItems: CartItem[];
  totalPrice: number;
}