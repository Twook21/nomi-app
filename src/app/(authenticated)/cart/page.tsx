"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth";
import type { Cart } from "@/types/cart";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const { isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
  const { token, logout } = useAuthStore();

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      let headers: HeadersInit = {};
      if (authMethod === "jwt" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`,
        {
          headers,
          credentials: authMethod === "nextauth" ? "include" : "omit",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Sesi Anda berakhir.", {
            description: "Silakan login kembali.",
          });
          logout();
          router.push("/auth/login");
          return;
        }
        throw new Error(
          (await response.json()).message || "Gagal mengambil data keranjang."
        );
      }

      const result = await response.json();
      setCart(result);
    } catch (error) {
      toast.error("Terjadi Kesalahan", {
        description:
          error instanceof Error
            ? error.message
            : "Tidak dapat terhubung ke server.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authMethod, token, logout, router]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace("/auth/login");
      } else {
        fetchCart();
      }
    }
  }, [authLoading, isAuthenticated, router, fetchCart]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const productInCart = cart?.cartItems.find(
      (item) => item.product.id === productId
    )?.product;
    if (productInCart && quantity > productInCart.stock) {
      toast.error("Stok tidak mencukupi.", {
        description: `Hanya ${productInCart.stock} tersedia.`,
      });
      return;
    }

    // Simpan ID notifikasi loading
    const loadingToastId = toast.loading("Memperbarui kuantitas...");
    try {
      let headers: HeadersInit = { "Content-Type": "application/json" };
      if (authMethod === "jwt" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${productId}`,
        {
          method: "PUT",
          headers,
          credentials: authMethod === "nextauth" ? "include" : "omit",
          body: JSON.stringify({ quantity }),
        }
      );
      if (!response.ok) {
        // Jika gagal, dismiss loading toast dan throw error
        toast.dismiss(loadingToastId);
        throw new Error(
          (await response.json()).message || "Gagal memperbarui kuantitas."
        );
      }

      // Jika berhasil, dismiss loading toast dan tampilkan success toast
      toast.dismiss(loadingToastId);
      toast.success("Kuantitas berhasil diperbarui.");
      fetchCart();
    } catch (error) {
      // Jika ada error di try block, dismiss loading toast dan tampilkan error toast
      toast.dismiss(loadingToastId);
      toast.error("Gagal memperbarui kuantitas.", {
        description:
          error instanceof Error ? error.message : "Error tidak diketahui.",
      });
    }
  };

  const handleRemoveItem = async (productId: string) => {
    // Simpan ID notifikasi loading
    const loadingToastId = toast.loading("Menghapus item...");
    try {
      let headers: HeadersInit = {};
      if (authMethod === "jwt" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/items/${productId}`,
        {
          method: "DELETE",
          headers,
          credentials: authMethod === "nextauth" ? "include" : "omit",
        }
      );
      if (!response.ok) {
        // Jika gagal, dismiss loading toast dan throw error
        toast.dismiss(loadingToastId);
        throw new Error(
          (await response.json()).message || "Gagal menghapus item."
        );
      }

      // Jika berhasil, dismiss loading toast dan tampilkan success toast
      toast.dismiss(loadingToastId);
      toast.success("Item berhasil dihapus dari keranjang.");
      fetchCart();
    } catch (error) {
      // Jika ada error di try block, dismiss loading toast dan tampilkan error toast
      toast.dismiss(loadingToastId);
      toast.error("Gagal menghapus item.", {
        description:
          error instanceof Error ? error.message : "Error tidak diketahui.",
      });
    }
  };

  const totalPrice = useMemo(() => {
    if (!cart || !cart.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => {
      const price =
        typeof item.product.discountedPrice === "number"
          ? item.product.discountedPrice
          : parseFloat(String(item.product.discountedPrice));
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  if (authLoading || isLoading) {
    return <CartLoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <p className="text-muted-foreground">
          Silakan login untuk melihat keranjang Anda.
        </p>
        <Button
          asChild
          className="mt-4 bg-nimo-yellow text-white hover:bg-nimo-yellow/90"
        >
          <Link href="/auth/login">Login</Link>
        </Button>
      </div>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <div className="container mx-auto text-center py-20">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Keranjang Anda Kosong</h1>
        <p className="mt-2 text-muted-foreground">
          Sepertinya Anda belum menambahkan produk apapun.
        </p>
        <Button
          asChild
          className="mt-6 bg-nimo-yellow text-white hover:bg-nimo-yellow/90"
        >
          <Link href="/products">Mulai Belanja</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <h1 className="text-3xl text-nimo-yellow font-bold tracking-tight mb-8">
        Keranjang Belanja
      </h1>
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Kolom Item Keranjang */}
        <div className="lg:col-span-2 space-y-6">
          {cart.cartItems.map((item) => (
            <Card
              key={item.id}
              className="flex items-center p-6 border rounded-2xl transition-all hover:shadow-lg"
            >
              <Image
                src={item.product.imageUrl || "https://placehold.co/100x100"}
                alt={item.product.productName}
                width={100}
                height={100}
                className="rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-grow ml-6">
                <Link
                  href={`/products/${item.product.id}`}
                  className="text-lg font-semibold hover:text-primary transition-colors"
                >
                  {item.product.productName}
                </Link>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatRupiah(item.product.discountedPrice)}
                </p>
                {item.quantity >= item.product.stock &&
                  item.product.stock > 0 && (
                    <p className="text-xs text-red-500 mt-2 font-medium">
                      Stok produk ini hampir habis!
                    </p>
                  )}
                {item.product.stock === 0 && (
                  <p className="text-xs text-red-500 mt-2 font-medium">
                    Produk ini sudah tidak tersedia!
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleUpdateQuantity(item.product.id, item.quantity - 1)
                  }
                  disabled={item.quantity <= 1 || item.product.stock === 0}
                  className="text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-base font-semibold">
                  {item.quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleUpdateQuantity(item.product.id, item.quantity + 1)
                  }
                  disabled={
                    item.quantity >= item.product.stock ||
                    item.product.stock === 0
                  }
                  className="text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => handleRemoveItem(item.product.id)}
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Kolom Ringkasan Pesanan */}
        <div className="lg:col-span-1">
          <Card className="p-6 rounded-2xl sticky top-24">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl font-bold mb-4">
                Ringkasan Pesanan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4 text-base">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal ({cart.cartItems.length} item)</span>
                <span className="font-semibold text-foreground">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Biaya Pengiriman</span>
                <span className="font-semibold text-foreground">Rp 0</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <span>Total</span>
                <span className="text-nimo-yellow">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="p-0 pt-6">
              <Button
                size="lg"
                className="w-full bg-nimo-yellow text-white hover:bg-nimo-yellow/90 font-semibold"
                asChild
                disabled={
                  cart.cartItems.length === 0 ||
                  cart.cartItems.some(
                    (item) =>
                      item.quantity > item.product.stock ||
                      item.product.stock === 0
                  )
                }
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

// Komponen UI Loading Keranjang
function CartLoadingSkeleton() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Skeleton className="h-9 w-72 mb-8" />
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="flex items-center p-6 border rounded-2xl">
              <Skeleton className="h-[100px] w-[100px] rounded-lg" />
              <div className="flex-grow ml-6 space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-8" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </Card>
          ))}
        </div>
        <div className="lg:col-span-1">
          <Card className="p-6 rounded-2xl">
            <CardHeader className="p-0">
              <Skeleton className="h-7 w-48 mb-4" />
            </CardHeader>
            <CardContent className="p-0 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
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
            <CardFooter className="p-0 pt-6">
              <Skeleton className="h-12 w-full" />
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
