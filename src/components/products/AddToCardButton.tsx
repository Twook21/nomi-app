/*
================================================================================
File: src/components/products/AddToCartButton.tsx (NEW FILE)
Description: Client Component untuk tombol "Tambah ke Keranjang" yang fungsional.
================================================================================
*/
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  productId: string;
}

export function AddToCartButton({ productId }: AddToCartButtonProps) {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    // 1. Cek apakah pengguna sudah login
    if (!token) {
      toast.error("Silakan login terlebih dahulu", {
        description: "Anda perlu masuk ke akun untuk menambahkan produk ke keranjang.",
        action: {
          label: "Login",
          onClick: () => router.push("/auth/login"),
        },
      });
      return;
    }

    setIsLoading(true);
    toast.loading("Menambahkan ke keranjang...");

    try {
      // 2. Kirim request ke API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: 1 }), // Sesuai dokumentasi API
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Gagal menambahkan produk.");
      }

      toast.success("Produk berhasil ditambahkan!", {
        description: "Cek keranjang belanja Anda untuk melanjutkan.",
        action: {
            label: "Lihat Keranjang",
            onClick: () => router.push("/cart"), // Arahkan ke halaman keranjang
        }
      });

    } catch (error) {
      toast.error("Oops, terjadi kesalahan", {
        description: error instanceof Error ? error.message : "Tidak dapat terhubung ke server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button size="lg" className="w-full text-lg" onClick={handleAddToCart} disabled={isLoading}>
      <ShoppingCart className="mr-2 h-6 w-6" />
      {isLoading ? "Memproses..." : "Tambah ke Keranjang"}
    </Button>
  );
}