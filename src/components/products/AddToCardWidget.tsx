"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { Cart } from "@/types/cart";

export function AddToCartWidget({ productId, stock }: { productId: string, stock: number }) {
  const { token, setCartCount, openCartSummary } = useAuthStore();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!token) { /* ... (login check) ... */ return; }
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error((await response.json()).message || "Gagal menambahkan produk.");
      
      // Ambil data keranjang terbaru untuk ditampilkan di dialog
      const cartRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`, { headers: { 'Authorization': `Bearer ${token}` } });
      const cartData: Cart = await cartRes.json();

      setCartCount(cartData.cartItems.length);
      openCartSummary(cartData); // Buka dialog dengan data terbaru
    } catch (error) {
      toast.error("Gagal menambahkan produk", { description: error instanceof Error ? error.message : "" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border rounded-full p-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQuantity(q => Math.max(1, q - 1))} disabled={quantity <= 1}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setQuantity(q => Math.min(stock, q + 1))} disabled={quantity >= stock}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
            <Button size="lg" className="flex-1 text-lg" onClick={handleAddToCart} disabled={isLoading}>
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