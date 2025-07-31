"use client";

import { useEffect, useState, useMemo, useCallback } from "react"; // Tambahkan useCallback
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
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
  // Gunakan useAuth hook untuk status otentikasi terpadu
  const { isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
  // Ambil token dan fungsi logout dari useAuthStore
  const { token, logout } = useAuthStore(); 
  
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi untuk memuat ulang data keranjang
  const fetchCart = useCallback(async () => {
    // Hanya fetch jika sudah terautentikasi dan tidak sedang dalam proses auth loading
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      let headers: HeadersInit = {};
      // Set header Authorization untuk JWT
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      // Untuk NextAuth, `credentials: 'include'` akan otomatis mengirim cookie

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`, {
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit', // Penting untuk NextAuth
      });

      if (!response.ok) {
        // Handle 401 Unauthorized secara spesifik jika terjadi pada fetch ini
        if (response.status === 401) {
          toast.error("Sesi Anda berakhir.", { description: "Silakan login kembali." });
          logout();
          router.push('/auth/login');
          return;
        }
        throw new Error((await response.json()).message || "Gagal mengambil data keranjang.");
      }

      const result = await response.json();
      setCart(result);
    } catch (error) {
      toast.error("Terjadi Kesalahan", {
        description: error instanceof Error ? error.message : "Tidak dapat terhubung ke server.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authMethod, token, logout, router]); // Tambahkan semua dependencies

  useEffect(() => {
    // Panggil fetchCart hanya jika isAuthenticated sudah diketahui dan tidak sedang authLoading
    if (!authLoading) {
        if (!isAuthenticated) {
            router.replace('/auth/login');
        } else {
            fetchCart();
        }
    }
  }, [authLoading, isAuthenticated, router, fetchCart]);

  // Fungsi untuk update kuantitas
  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return; // Mencegah kuantitas di bawah 1
    // Ambil stok produk dari cart yang sudah dimuat
    const productInCart = cart?.cartItems.find(item => item.product.id === productId)?.product;
    if (productInCart && quantity > productInCart.stock) {
        toast.error("Stok tidak mencukupi.", { description: `Hanya ${productInCart.stock} tersedia.` });
        return;
    }

    toast.loading("Memperbarui kuantitas...");
    try {
      let headers: HeadersInit = { "Content-Type": "application/json" };
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${productId}`, {
        method: 'PUT',
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
        body: JSON.stringify({ quantity }),
      });
      if (!response.ok) throw new Error((await response.json()).message || "Gagal memperbarui kuantitas.");
      
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
      let headers: HeadersInit = {};
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${productId}`, {
        method: 'DELETE',
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
      });
      if (!response.ok) throw new Error((await response.json()).message || "Gagal menghapus item.");

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
      // Pastikan item.product.discountedPrice adalah number sebelum perkalian
      const price = typeof item.product.discountedPrice === 'number' 
                    ? item.product.discountedPrice 
                    : parseFloat(String(item.product.discountedPrice)); // Konversi Decimal dari Prisma
      return total + price * item.quantity;
    }, 0);
  }, [cart]);


  // Tampilkan loading skeleton jika sedang loading auth atau data
  if (authLoading || isLoading) {
    return <CartLoadingSkeleton />;
  }

  // Tampilkan pesan jika tidak terautentikasi (setelah loading selesai)
  if (!isAuthenticated) {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center">
                <p className="text-muted-foreground">Silakan login untuk melihat keranjang Anda.</p>
                <Button asChild className="mt-4 bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                    <Link href="/auth/login">Login</Link>
                </Button>
            </div>
        </div>
    );
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
                {/* Tampilkan sisa stok jika mendekati batas */}
                {item.quantity >= item.product.stock && item.product.stock > 0 && (
                    <p className="text-xs text-red-500 mt-1">Stok produk ini hampir habis!</p>
                )}
                {item.product.stock === 0 && (
                    <p className="text-xs text-red-500 mt-1">Produk ini sudah tidak tersedia!</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1} // Disable jika kuantitas 1
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{item.quantity}</span>
                <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock} // Disable jika sudah mencapai stok
                >
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
              <Button size="lg" className="w-full bg-nimo-yellow text-white hover:bg-nimo-yellow/90" asChild
                disabled={cart.cartItems.length === 0 || cart.cartItems.some(item => item.quantity > item.product.stock || item.product.stock === 0)} // Disable checkout jika ada masalah stok
              >
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