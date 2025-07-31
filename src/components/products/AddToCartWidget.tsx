"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { Cart } from "@/types/cart";

export function AddToCartWidget({ productId, stock }: { productId: string, stock: number }) {
  // Gunakan useAuth hook untuk status otentikasi terpadu
  const { isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
  // Ambil token dan fungsi store lainnya dari useAuthStore
  const { token, setCartCount, openCartSummary, logout } = useAuthStore();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    // Tampilkan pesan atau redirect jika belum terautentikasi
    if (!isAuthenticated) {
      toast.info("Silakan login untuk menambahkan produk ke keranjang.", {
        action: {
          label: "Login",
          onClick: () => router.push('/auth/login'),
        },
      });
      return;
    }

    setIsLoading(true);
    try {
      let headers: HeadersInit = { "Content-Type": "application/json" };

      // Tambahkan header Authorization hanya jika metode otentikasi adalah JWT
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      // Untuk NextAuth, `credentials: 'include'` akan menangani cookie secara otomatis

      // Permintaan untuk menambahkan produk ke keranjang
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${productId}`, {
        method: "POST",
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit', // Penting untuk NextAuth
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        // Handle 401 Unauthorized secara spesifik jika terjadi pada fetch ini
        if (response.status === 401) {
          toast.error("Sesi Anda berakhir. Silakan login kembali.");
          logout();
          router.push('/auth/login');
          return;
        }
        throw new Error((await response.json()).message || "Gagal menambahkan produk.");
      }

      // Ambil data keranjang terbaru untuk ditampilkan di dialog
      const cartRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`, { 
        headers: authMethod === 'jwt' && token ? { 'Authorization': `Bearer ${token}` } : {}, // Hanya kirim header jika JWT
        credentials: authMethod === 'nextauth' ? 'include' : 'omit', // Penting untuk NextAuth
      });

      if (!cartRes.ok) {
          if (cartRes.status === 401) {
              toast.error("Sesi Anda berakhir saat mengambil keranjang. Silakan login kembali.");
              logout();
              router.push('/auth/login');
              return;
          }
          throw new Error("Gagal mengambil data keranjang terbaru.");
      }
      
      const cartData: Cart = await cartRes.json();

      setCartCount(cartData.cartItems.length); // Gunakan _count.cartItems untuk jumlah item
      openCartSummary(cartData); // Buka dialog dengan data terbaru
      toast.success("Produk berhasil ditambahkan ke keranjang!"); // Feedback positif
    } catch (error) {
      toast.error("Gagal menambahkan produk", { description: error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border rounded-full p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1 || isLoading}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQuantity(q => Math.min(stock, q + 1))} disabled={quantity >= stock || isLoading}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            {/* Tombol Add to Cart akan disable jika sedang loading atau belum terautentikasi (atau sedang memuat status auth) */}
            <Button size="lg" className="flex-1 text-lg" onClick={handleAddToCart} disabled={isLoading || authLoading || !isAuthenticated}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isLoading ? "Memproses..." : "Tambah ke Keranjang"}
            </Button>
        </div>
        <Button size="lg" variant="outline" className="w-full" asChild>
            <Link href="/cart">Lanjut ke Keranjang</Link>
        </Button>
    </div>
  );
}