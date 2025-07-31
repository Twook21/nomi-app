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
import { useAuthStore } from "@/store/auth";
import { signIn, getSession } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const formSchema = z.object({
  identifier: z.string().min(1, "Email atau username tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

export function LoginForm() {
  const router = useRouter();
  const { setToken, setUser, setAuthMethod } = useAuthStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Existing credential login function
  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.loading("Mencoba masuk...");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Login gagal.");

      if (result.token && result.user) {
        setToken(result.token);
        setUser(result.user);
        setAuthMethod('jwt');

        toast.success("Login Berhasil!", { duration: 1500 });

        setTimeout(() => {
          // PERBAIKAN: Logika redirect yang lebih aman
          if (result.user.role === "admin") {
            router.push("/admin");
          } else {
            // Semua peran lain (customer, umkm_owner) masuk ke dasbor customer
            router.push("/profile");
          }
          router.refresh();
        }, 1500);
      } else {
        throw new Error("Respons tidak valid dari server.");
      }
    } catch (error) {
      toast.error("Oh, terjadi kesalahan!", {
        description:
          error instanceof Error ? error.message : "Error tidak diketahui",
      });
    }
  }

  // Google OAuth login
  async function handleGoogleSignIn() {
    try {
      toast.loading("Masuk dengan Google...");
      
      const result = await signIn('google', { 
        redirect: false,
        callbackUrl: '/profile'
      });

      if (result?.ok) {
        // Get session after successful sign in
        const session = await getSession();
        
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.name,
            image: session.user.image,
            username: session.user.username,
            role: session.user.role as any,
            umkmProfileStatus: session.user.umkmProfileStatus as any,
          });
          setAuthMethod('nextauth');
          
          toast.success("Login dengan Google berhasil!");
          router.push('/profile');
        }
      } else {
        throw new Error("Login dengan Google gagal");
      }
    } catch (error) {
      toast.error("Login dengan Google gagal", {
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
        {/* Google Sign In Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full mb-4"
          onClick={handleGoogleSignIn}
        >
          <FcGoogle className="mr-2 h-4 w-4" />
          Masuk dengan Google
        </Button>
        
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Atau lanjutkan dengan
            </span>
          </div>
        </div>

        {/* Existing form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email atau Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="m@example.com atau johndoe"
                      {...field}
                    />
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
            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting}
            >
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