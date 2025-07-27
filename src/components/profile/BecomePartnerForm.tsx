"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

const partnerSchema = z.object({
  umkmName: z.string().min(3, "Nama UMKM minimal 3 karakter."),
  umkmDescription: z.string().min(10, "Deskripsi minimal 10 karakter."),
  umkmAddress: z.string().min(10, "Alamat UMKM minimal 10 karakter."),
  umkmPhoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit."),
  umkmEmail: z.string().email("Format email tidak valid."),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
});

export function BecomePartnerForm() {
  const { token, setUser, user } = useAuthStore();
  const router = useRouter();

  const form = useForm<z.infer<typeof partnerSchema>>({
    resolver: zodResolver(partnerSchema),
    defaultValues: { /* ... */ },
  });

  async function onSubmit(values: z.infer<typeof partnerSchema>) {
    toast.loading("Mengirim pendaftaran...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal mendaftar.");

      // Update state user untuk menandakan ada pendaftaran pending
      if (user) {
        setUser({ ...user, hasPendingUmkmProfile: true });
      }

      toast.success("Pendaftaran berhasil!", {
        description: "Pendaftaran Anda sedang ditinjau oleh admin.",
      });
      
      // PERBAIKAN: Arahkan ke halaman pending
      router.push("/profile/pending-verification");
      router.refresh();

    } catch (error) {
      toast.error("Gagal mendaftar.", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan server.",
      });
    }
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
            <FormItem><FormLabel>Nama Bank</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
           <FormField control={form.control} name="bankAccountNumber" render={({ field }) => (
            <FormItem><FormLabel>Nomor Rekening</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <Button type="submit" className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Mendaftar..." : "Daftar Sebagai Mitra"}
        </Button>
      </form>
    </Form>
  );
}