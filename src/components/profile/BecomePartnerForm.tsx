"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";
import { useEffect } from "react";
import { useSession } from "next-auth/react"; 

const partnerSchema = z.object({
  umkmName: z.string().min(3, "Nama UMKM minimal 3 karakter."),
  umkmDescription: z.string().min(10, "Deskripsi minimal 10 karakter."),
  umkmAddress: z.string().min(10, "Alamat UMKM minimal 10 karakter."),
  umkmPhoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit."),
  umkmEmail: z.string().email("Format email tidak valid."),
  bankName: z.string().optional().nullable(),
  bankAccountNumber: z.string().optional().nullable(),
});

export function BecomePartnerForm() {
  const { isAuthenticated, isLoading: authLoading, authMethod, user } = useAuth();
  const { token, setUser, logout } = useAuthStore();
  const { update: updateSession } = useSession(); 
  const router = useRouter();

  const form = useForm<z.infer<typeof partnerSchema>>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      umkmName: "",
      umkmDescription: "",
      umkmAddress: "",
      umkmPhoneNumber: user?.phoneNumber || "",
      umkmEmail: user?.email || "",
      bankName: "",
      bankAccountNumber: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        ...form.getValues(),
        umkmPhoneNumber: user.phoneNumber || form.getValues().umkmPhoneNumber || "",
        umkmEmail: user.email || form.getValues().umkmEmail || "",
      });
    }
  }, [user, form]);

  async function onSubmit(values: z.infer<typeof partnerSchema>) {
    if (!isAuthenticated) {
        toast.error("Anda harus login untuk mendaftar sebagai mitra UMKM.", {
            action: {
                label: "Login",
                onClick: () => router.push('/auth/login'),
            },
        });
        return;
    }

    toast.loading("Mengirim pendaftaran...");
    try {
      let headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/register`, {
        method: "POST",
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
            toast.error("Sesi Anda berakhir. Silakan login kembali.");
            logout();
            router.push('/auth/login');
            return;
        }
        throw new Error(result.message || "Gagal mendaftar.");
      }

      if (authMethod === 'nextauth') {
        await updateSession(); 
        
        setTimeout(() => {
          router.refresh(); 
        }, 100);
      } else {
        if (user) {
          setUser({
              ...user,
              role: user.role as 'customer' | 'umkm_owner' | 'admin',
              umkmProfileStatus: 'pending'
          });
        }
      }

      toast.success("Pendaftaran berhasil!", {
        description: "Pendaftaran Anda sedang ditinjau oleh admin.",
      });
      
      router.push("/profile/pending-verification");

    } catch (error) {
      toast.error("Gagal mendaftar.", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan server.",
      });
    }
  }

  if (authLoading) {
    return (
        <div className="space-y-8">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="grid md:grid-cols-2 gap-8">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-12 w-48" />
        </div>
    );
  }

  if (!isAuthenticated) {
    return (
        <div className="text-center py-10">
            <h2 className="text-xl font-bold mb-4">Anda harus login untuk menjadi mitra.</h2>
            <Button asChild className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                <Link href="/auth/login">Login Sekarang</Link>
            </Button>
        </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField control={form.control} name="umkmName" render={({ field }) => (
          <FormItem><FormLabel>Nama Toko / UMKM</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="umkmDescription" render={({ field }) => (
          <FormItem><FormLabel>Deskripsi Toko</FormLabel><FormControl><Textarea {...field} rows={4} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="umkmAddress" render={({ field }) => (
          <FormItem><FormLabel>Alamat Toko</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid md:grid-cols-2 gap-8">
          <FormField control={form.control} name="umkmEmail" render={({ field }) => (
            <FormItem><FormLabel>Email Toko</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="umkmPhoneNumber" render={({ field }) => (
            <FormItem><FormLabel>Nomor Telepon Toko</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <Separator />
        <div>
          <h3 className="text-lg font-medium">Informasi Bank (Opsional)</h3>
          <p className="text-sm text-muted-foreground">Digunakan untuk keperluan transaksi.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
           <FormField control={form.control} name="bankName" render={({ field }) => (
            <FormItem><FormLabel>Nama Bank</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> 
          )} />
           <FormField control={form.control} name="bankAccountNumber" render={({ field }) => (
            <FormItem><FormLabel>Nomor Rekening</FormLabel><FormControl><Input {...field} value={field.value || ''} /></FormControl><FormMessage /></FormItem> 
          )} />
        </div>
        <Button type="submit" className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Mendaftar..." : "Daftar Sebagai Mitra"}
        </Button>
      </form>
    </Form>
  );
}