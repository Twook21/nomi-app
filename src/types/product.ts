export interface Product {
  id: string;
  productName: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  stock: number;
  imageUrl: string;
  expirationDate: string;
  // PERBAIKAN: Menggunakan 'umkmOwner' agar cocok dengan data dari API
  umkmOwner: {
    id: string;
    umkmName: string;
  };
  // Anda bisa menambahkan properti lain jika ada
}