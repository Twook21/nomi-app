/*
================================================================================
File: src/components/auth/login-form.tsx (UPDATED)
Description: Update form login untuk menyimpan token ke Zustand store.
================================================================================
*/
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
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth"; // <-- 1. Impor store

// Skema validasi disesuaikan dengan API
const formSchema = z.object({
  identifier: z.string().min(1, "Email atau username tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

export function LoginForm() {
  const router = useRouter();
  const { setToken } = useAuthStore(); // <-- 2. Ambil fungsi setToken

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Mencoba masuk...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Login gagal, periksa kembali email/password Anda.");
      }

      // Pastikan API mengembalikan token dalam format { token: '...' }
      if (result.token) {
        setToken(result.token); // <-- 3. Simpan token ke store
        toast.success("Login Berhasil! 🎉", {
          description: "Selamat datang kembali! Anda akan dialihkan...",
          duration: 2000,
        });
        setTimeout(() => {
          router.push('/profile'); // Alihkan ke halaman profil
          router.refresh(); // Refresh halaman untuk update UI (seperti navbar)
        }, 2000);
      } else {
        throw new Error("Token tidak diterima dari server.");
      }

    } catch (error) {
      toast.error("Oh, terjadi kesalahan!", {
        description: error instanceof Error ? error.message : "Error tidak diketahui",
      });
    }
  }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Masukkan email atau username untuk masuk ke akun Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email atau Username</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com atau johndoe" {...field} />
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
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Memproses..." : "Login"}
            </Button>
          </form>
        </Form>
        <div className="mt-4 text-center text-sm">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="underline">
            Register di sini
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
