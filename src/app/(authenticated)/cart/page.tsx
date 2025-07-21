"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import type { Cart } from "@/types/cart";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Fungsi untuk format mata uang Rupiah
function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Komponen utama halaman keranjang
export default function CartPage() {
  const router = useRouter();
  const { token, logout } = useAuthStore();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk memuat ulang data keranjang
  const fetchCart = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.status === 401) {
        toast.error("Sesi Anda berakhir.", { description: "Silakan login kembali." });
        logout();
        router.push('/auth/login');
        return;
      }

      if (!response.ok) throw new Error("Gagal mengambil data keranjang.");

      const result = await response.json();
      // PERBAIKAN: Langsung set result dari API
      setCart(result);
    } catch (error) {
      toast.error("Terjadi Kesalahan", {
        description: error instanceof Error ? error.message : "Tidak dapat terhubung ke server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      router.replace('/auth/login');
    } else {
      fetchCart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, router]);

  // Fungsi untuk update kuantitas
  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    toast.loading("Memperbarui kuantitas...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error("Gagal memperbarui kuantitas.");
      
      toast.success("Kuantitas berhasil diperbarui.");
      fetchCart(); // Muat ulang data keranjang
    } catch (error) {
      toast.error("Gagal memperbarui kuantitas.", {
        description: error instanceof Error ? error.message : "Error tidak diketahui.",
      });
    }
  };

  // Fungsi untuk menghapus item
  const handleRemoveItem = async (productId: string) => {
    toast.loading("Menghapus item...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal menghapus item.");

      toast.success("Item berhasil dihapus dari keranjang.");
      fetchCart();
    } catch (error) {
      toast.error("Gagal menghapus item.", {
        description: error instanceof Error ? error.message : "Error tidak diketahui.",
      });
    }
  };

  // Menghitung total harga di sisi klien
  const totalPrice = useMemo(() => {
    if (!cart || !cart.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => {
      return total + item.product.discountedPrice * item.quantity;
    }, 0);
  }, [cart]);


  if (isLoading) {
    return <CartLoadingSkeleton />;
  }

  // PERBAIKAN: Menggunakan cart.cartItems
  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto text-center py-20">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Keranjang Anda Kosong</h1>
        <p className="mt-2 text-muted-foreground">Sepertinya Anda belum menambahkan produk apapun.</p>
        <Button asChild className="mt-6 bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
          <Link href="/products">Mulai Belanja</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Keranjang Belanja</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {/* PERBAIKAN: Menggunakan cart.cartItems */}
          {cart.cartItems.map((item) => (
            <Card key={item.id} className="flex items-center p-4">
              <Image
                src={item.product.imageUrl || "https://placehold.co/100x100"}
                alt={item.product.productName}
                width={80}
                height={80}
                className="rounded-md object-cover border"
              />
              <div className="flex-grow ml-4">
                <Link href={`/products/${item.product.id}`} className="font-semibold hover:underline">
                  {item.product.productName}
                </Link>
                <p className="text-sm text-muted-foreground">{formatRupiah(item.product.discountedPrice)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="ml-4 text-red-500 hover:text-red-700" onClick={() => handleRemoveItem(item.product.id)}>
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">{formatRupiah(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Pengiriman</span>
                <span className="font-semibold">Rp 0</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-4">
                <span>Total</span>
                <span>{formatRupiah(totalPrice)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full bg-nimo-yellow text-white hover:bg-nimo-yellow/90" asChild>
                <Link href="/checkout">Lanjut ke Checkout</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Komponen untuk UI Loading Keranjang
function CartLoadingSkeleton() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Skeleton className="h-9 w-64 mb-6" />
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex items-center p-4">
              <Skeleton className="h-20 w-20 rounded-md" />
              <div className="flex-grow ml-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-10 ml-4" />
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <Skeleton className="h-7 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="flex justify-between border-t pt-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-28" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-12 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}