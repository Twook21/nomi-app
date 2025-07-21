"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Cart } from "@/types/cart";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";

// Skema Zod yang sudah diperbaiki
const checkoutSchema = z.object({
  shippingAddress: z.string().min(10, "Alamat pengiriman harus diisi, minimal 10 karakter."),
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
  const { token, user, logout } = useAuthStore();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: user?.address || "",
      paymentMethod: "Cash on Pickup",
    },
  });

  useEffect(() => {
    if (!token) {
      router.replace('/auth/login');
      return;
    }

    const fetchData = async () => {
      try {
        const cartResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!cartResponse.ok) throw new Error("Gagal memuat keranjang.");
        const cartResult = await cartResponse.json();

        // PERBAIKAN: Cek 'cartResult' dan 'cartResult.cartItems'
        if (!cartResult || !cartResult.cartItems || cartResult.cartItems.length === 0) {
          toast.error("Keranjang Anda kosong.", { description: "Anda akan diarahkan kembali." });
          router.replace('/cart');
          return;
        }

        // PERBAIKAN: Set 'cartResult' langsung
        setCart(cartResult);
        form.setValue("shippingAddress", user?.address || cartResult.shippingAddress || "");
      } catch (error) {
        toast.error("Gagal memuat data checkout.", { description: error instanceof Error ? error.message : "" });
        router.replace('/cart');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, user, router, form, logout]);

  // Menghitung total harga di sisi klien
  const totalPrice = useMemo(() => {
    if (!cart || !cart.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => {
      return total + item.product.discountedPrice * item.quantity;
    }, 0);
  }, [cart]);

  const onSubmit = async (data: z.infer<typeof checkoutSchema>) => {
    toast.loading("Memproses pesanan Anda...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal membuat pesanan.");

      toast.success("Pesanan berhasil dibuat! 🎉", {
        description: "Terima kasih telah berbelanja.",
      });
      
      router.push('/profile/orders');

    } catch (error) {
      toast.error("Gagal membuat pesanan.", {
        description: error instanceof Error ? error.message : "Silakan coba lagi.",
      });
    }
  };

  if (isLoading) {
    return <p className="container mx-auto py-8">Memuat checkout...</p>;
  }

  if (!cart) {
    return null; // Akan di-redirect oleh useEffect
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader><CardTitle>Alamat Pengiriman</CardTitle></CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Masukkan alamat lengkap Anda..." {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Metode Pembayaran</CardTitle></CardHeader>
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
              <CardHeader><CardTitle>Ringkasan Pesanan</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {/* PERBAIKAN: Menggunakan cart.cartItems */}
                {cart.cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <span className="truncate pr-2">{item.product.productName} x{item.quantity}</span>
                    <span className="font-medium whitespace-nowrap">{formatRupiah(item.product.discountedPrice * item.quantity)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-lg font-bold border-t pt-4 mt-4">
                  <span>Total</span>
                  <span>{formatRupiah(totalPrice)}</span>
                </div>
              </CardContent>
            </Card>
            <Button type="submit" size="lg" className="w-full mt-6 bg-nimo-yellow text-white hover:bg-nimo-yellow/90" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Memproses..." : "Buat Pesanan"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}