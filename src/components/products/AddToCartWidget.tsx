"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { Cart } from "@/types/cart";
import { Input } from "@/components/ui/input";

export function AddToCartWidget({ productId, stock }: { productId: string, stock: number }) {
  const { isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
  const { token, setCartCount, openCartSummary, logout } = useAuthStore();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Silakan login untuk menambahkan produk ke keranjang.", {
        action: {
          label: "Login",
          onClick: () => router.push('/auth/login'),
        },
      });
      return;
    }

    if (quantity < 1 || quantity > stock) {
        toast.error(`Jumlah harus antara 1 sampai ${stock}.`);
        return;
    }

    setIsLoading(true);
    try {
      let headers: HeadersInit = { "Content-Type": "application/json" };
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${productId}`, {
        method: "POST",
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Sesi Anda berakhir. Silakan login kembali.");
          logout();
          router.push('/auth/login');
          return;
        }
        throw new Error((await response.json()).message || "Gagal menambahkan produk.");
      }

      const cartRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`, { 
        headers: authMethod === 'jwt' && token ? { 'Authorization': `Bearer ${token}` } : {},
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
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
      setCartCount(cartData.cartItems.length);
      openCartSummary(cartData);
      toast.success("Produk berhasil ditambahkan ke keranjang!");
    } catch (error) {
      toast.error("Gagal menambahkan produk", { description: error instanceof Error ? error.message : "Terjadi kesalahan tidak terduga." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      setQuantity(Math.min(stock, Math.max(1, value)));
    } else {
      setQuantity(1);
    }
  };

  return (
    <div className="space-y-3 md:space-y-4">
        <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-1 md:gap-2 border rounded-full p-0.5 md:p-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8 rounded-full" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1 || isLoading}>
                    <Minus className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                
                <Input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  max={stock}
                  className="w-8 md:w-10 text-center font-bold text-base md:text-lg border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto bg-transparent"
                />
                
                <Button variant="ghost" size="icon" className="h-7 w-7 md:h-8 md:w-8 rounded-full" onClick={() => setQuantity(q => Math.min(stock, q + 1))} disabled={quantity >= stock || isLoading}>
                    <Plus className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
            </div>
            
            <Button size="lg" className="flex-1 text-base md:text-lg dark:bg-nimo-yellow dark:text-nimo-dark" onClick={handleAddToCart} disabled={isLoading || authLoading || !isAuthenticated || quantity < 1 || quantity > stock}>
                <ShoppingCart className="mr-1 md:mr-2 h-4 w-4 md:h-5 md:w-5" />
                {isLoading ? "Memproses..." : "Tambah ke Keranjang"}
            </Button>
        </div>
        <Button size="lg" variant="outline" className="w-full text-base md:text-lg" asChild>
            <Link href="/cart">Lanjut ke Keranjang</Link>
        </Button>
    </div>
  );
}