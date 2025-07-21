"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // <--- GANTI DENGAN INI
import Link from "next/link";
import { useRouter } from "next/navigation";

// Skema validasi menggunakan Zod, disesuaikan dengan API
const formSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  phoneNumber: z.string().min(10, "Nomor telepon tidak valid"),
  address: z.string().min(5, "Alamat tidak boleh kosong"),
});

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Ganti cara memanggil notifikasi seperti ini
    toast.loading("Mencoba mendaftar...");

    try {
      const payload = { ...values, role: "customer" };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registrasi gagal, silakan coba lagi.");
      }
      
      // Panggil notifikasi sukses dari sonner
      toast.success("Registrasi Berhasil! 🎉", {
        description: "Anda akan dialihkan ke halaman login.",
        duration: 2000,
      });
      
      setTimeout(() => router.push('/auth/login'), 2000);

    } catch (error) {
      // Panggil notifikasi error dari sonner
      toast.error("Oh, terjadi kesalahan!", {
        description: error instanceof Error ? error.message : "Error tidak diketahui",
      });
    }
  }

  // ... sisa return statement (tidak ada yang berubah di sini)
  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Buat akun baru untuk mulai menyelamatkan makanan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="john doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="081234567890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat</FormLabel>
                  <FormControl>
                    <Input placeholder="Jl. Merdeka No. 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Memproses..." : "Buat Akun"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="underline">
            Login di sini
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}