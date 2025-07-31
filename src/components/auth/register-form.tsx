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
import { useAuthStore } from "@/store/auth"; // Import auth store

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
  const { setUser, setToken } = useAuthStore(); // Destructure setUser dan setToken
  
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
    toast.loading("Mencoba mendaftar...", { id: "register" });

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
      
      // PENTING: Simpan token dan user data ke store setelah register berhasil
      console.log('Register successful, result:', result);
      
      if (result.token) {
        console.log('Setting token after register');
        setToken(result.token);
      }
      
      if (result.user) {
        console.log('Setting user after register');
        // Pastikan user object sesuai dengan interface User
        const userData = {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          name: result.user.name || null,
          image: result.user.image || null,
          role: result.user.role,
          umkmProfileStatus: null, // Default untuk user baru
          address: values.address || null, // Dari form
          phoneNumber: values.phoneNumber || null, // Dari form
        };
        setUser(userData);
      }
      
      toast.success("Registrasi Berhasil! 🎉", {
        id: "register",
        description: "Anda akan dialihkan ke halaman profile.",
        duration: 2000,
      });
      
      // Redirect ke profile settings alih-alih login
      setTimeout(() => router.push('/profile/settings'), 2000);

    } catch (error) {
      toast.error("Oh, terjadi kesalahan!", {
        id: "register",
        description: error instanceof Error ? error.message : "Error tidak diketahui",
      });
    }
  }

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