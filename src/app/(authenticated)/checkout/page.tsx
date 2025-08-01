"use client";

import { useEffect, useState, useMemo, useCallback } from "react"; // Tambahkan useCallback
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Cart } from "@/types/cart";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link"; // Import Link for login button
import { ShoppingCart } from "lucide-react";

// Skema Zod yang sudah diperbaiki
const checkoutSchema = z.object({
  shippingAddress: z
    .string()
    .min(10, "Alamat pengiriman harus diisi, minimal 10 karakter."),
  paymentMethod: z.enum(["Cash on Pickup"]),
});

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export default function CheckoutPage() {
  const router = useRouter();
  // Gunakan useAuth hook untuk status otentikasi terpadu
  const {
    isAuthenticated,
    isLoading: authLoading,
    authMethod,
    user,
  } = useAuth(); // Ambil user dari useAuth
  // Ambil token dan logout dari useAuthStore
  const { token, logout } = useAuthStore();

  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: user?.address || "", // Gunakan user dari useAuth
      paymentMethod: "Cash on Pickup",
    },
  });

  // Fungsi untuk memuat data keranjang dan mengisi form
  const fetchData = useCallback(async () => {
    // Hanya fetch jika sudah terautentikasi dan tidak sedang dalam proses auth loading
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      let headers: HeadersInit = {};
      if (authMethod === "jwt" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const cartResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`,
        {
          headers,
          credentials: authMethod === "nextauth" ? "include" : "omit",
        }
      );

      if (!cartResponse.ok) {
        if (cartResponse.status === 401) {
          toast.error("Sesi Anda berakhir.", {
            description: "Silakan login kembali.",
          });
          logout();
          router.push("/auth/login");
          return;
        }
        throw new Error(
          (await cartResponse.json()).message || "Gagal memuat keranjang."
        );
      }

      const cartResult = await cartResponse.json();

      if (
        !cartResult ||
        !cartResult.cartItems ||
        cartResult.cartItems.length === 0
      ) {
        toast.error("Keranjang Anda kosong.", {
          description: "Anda akan diarahkan kembali.",
        });
        router.replace("/cart");
        return;
      }

      setCart(cartResult);
      // Set default value untuk shippingAddress dari user profile atau cart yang ada
      form.setValue(
        "shippingAddress",
        user?.address || cartResult.shippingAddress || ""
      );
    } catch (error) {
      toast.error("Gagal memuat data checkout.", {
        description:
          error instanceof Error
            ? error.message
            : "Tidak dapat terhubung ke server.",
      });
      router.replace("/cart");
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authMethod, token, user, router, form, logout]); // Tambahkan semua dependencies

  useEffect(() => {
    // Panggil fetchData hanya jika isAuthenticated sudah diketahui dan tidak sedang authLoading
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace("/auth/login");
      } else {
        fetchData();
      }
    }
  }, [authLoading, isAuthenticated, router, fetchData]);

  // Menghitung total harga di sisi klien
  const totalPrice = useMemo(() => {
    if (!cart || !cart.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => {
      // Pastikan item.product.discountedPrice adalah number sebelum perkalian
      const price =
        typeof item.product.discountedPrice === "number"
          ? item.product.discountedPrice
          : parseFloat(String(item.product.discountedPrice));
      return total + price * item.quantity;
    }, 0);
  }, [cart]);

  const onSubmit = async (data: z.infer<typeof checkoutSchema>) => {
    // Simpan ID notifikasi loading
    const loadingToastId = toast.loading("Memproses pesanan Anda...");

    try {
      let headers: HeadersInit = { "Content-Type": "application/json" };
      if (authMethod === "jwt" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`,
        {
          method: "POST",
          headers,
          credentials: authMethod === "nextauth" ? "include" : "omit",
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        // Hapus toast loading dan tampilkan toast error
        toast.dismiss(loadingToastId);
        if (response.status === 401) {
          toast.error("Sesi Anda berakhir. Silakan login kembali.");
          logout();
          router.push("/auth/login");
          return;
        }
        throw new Error(result.message || "Gagal membuat pesanan.");
      }

      // Hapus toast loading dan tampilkan toast success
      toast.dismiss(loadingToastId);
      toast.success("Pesanan berhasil dibuat! 🎉", {
        description: "Terima kasih telah berbelanja.",
      });

      router.push("/profile/orders"); // Redirect ke halaman riwayat pesanan
    } catch (error) {
      // Hapus toast loading dan tampilkan toast error
      toast.dismiss(loadingToastId);
      toast.error("Gagal membuat pesanan.", {
        description:
          error instanceof Error ? error.message : "Silakan coba lagi.",
      });
    }
  };

  // Tampilkan loading skeleton jika sedang loading auth atau data
  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-9 w-64 mb-6" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-12 w-full mt-6 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // Tampilkan pesan jika tidak terautentikasi (setelah loading selesai)
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p className="text-muted-foreground">
            Silakan login untuk melanjutkan checkout.
          </p>
          <Button
            asChild
            className="mt-4 bg-nimo-yellow text-white hover:bg-nimo-yellow/90"
          >
            <Link href="/auth/login">Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Jika keranjang kosong setelah loading, redirect ke halaman keranjang
  if (!cart || cart.cartItems.length === 0) {
    // Ini akan di-handle oleh fetchData yang me-redirect, jadi ini hanya fallback UI
    return (
      <div className="container mx-auto text-center py-20">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Keranjang Anda Kosong</h1>
        <p className="mt-2 text-muted-foreground">
          Anda akan diarahkan kembali ke halaman keranjang.
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl text-nimo-yellow font-bold mb-6">Checkout</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid lg:grid-cols-3 gap-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alamat Pengiriman</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Masukkan alamat lengkap Anda..."
                          {...field}
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Cash on Pickup" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Cash on Pickup (Bayar saat ambil barang)
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="truncate pr-2">
                      {item.product.productName} x{item.quantity}
                    </span>
                    <span className="font-medium whitespace-nowrap">
                      {formatRupiah(
                        item.product.discountedPrice * item.quantity
                      )}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between text-lg font-bold border-t pt-4 mt-4">
                  <span>Total</span>
                  <span className="text-nimo-yellow">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Button
              type="submit"
              size="lg"
              className="w-full mt-6 bg-nimo-yellow text-white hover:bg-nimo-yellow/90"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Memproses..." : "Buat Pesanan"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
