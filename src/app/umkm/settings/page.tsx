"use client";

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import type { UmkmProfile } from '@/types/umkm_profile';

// PERBAIKAN: Skema Zod disesuaikan untuk menerima nilai null
const umkmProfileSchema = z.object({
  umkmName: z.string().min(3, "Nama UMKM minimal 3 karakter."),
  umkmDescription: z.string().min(10, "Deskripsi minimal 10 karakter."),
  umkmAddress: z.string().min(10, "Alamat UMKM minimal 10 karakter."),
  umkmPhoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit."),
  umkmEmail: z.string().email("Format email tidak valid."),
  bankName: z.string().nullable().optional(),
  bankAccountNumber: z.string().nullable().optional(),
});

export default function UmkmSettingsPage() {
  const { token } = useAuthStore();
  const [profile, setProfile] = useState<UmkmProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof umkmProfileSchema>>({
    resolver: zodResolver(umkmProfileSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Gagal mengambil profil UMKM.");
        const result = await response.json();
        setProfile(result);
        // PERBAIKAN: Menyesuaikan data untuk form.reset
        form.reset({
          ...result,
          bankName: result.bankName || "",
          bankAccountNumber: result.bankAccountNumber || "",
        });
      } catch (error) {
        toast.error("Gagal memuat profil.", { description: error instanceof Error ? error.message : "" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [token, form]);

  const onSubmit = async (values: z.infer<typeof umkmProfileSchema>) => {
    toast.loading("Menyimpan perubahan...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal memperbarui profil.");
      
      setProfile(result.umkm); // Update state dengan data terbaru
      toast.success("Profil toko berhasil diperbarui!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Gagal menyimpan.", { description: error instanceof Error ? error.message : "" });
    }
  };

  if (isLoading) return <div className="p-8 text-center">Memuat pengaturan toko...</div>;
  if (!profile) return <div className="p-8 text-center">Gagal memuat profil toko.</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pengaturan Toko</h1>
        <p className="text-muted-foreground">Kelola informasi toko dan preferensi Anda.</p>
      </div>
      <Separator />
      <Card>
        <CardHeader>
          <CardTitle>Profil Toko</CardTitle>
          <CardDescription>Informasi ini akan ditampilkan kepada pelanggan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control} name="umkmName" render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Toko / UMKM</FormLabel>
                  <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="umkmDescription" render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Toko</FormLabel>
                  <FormControl><Textarea {...field} disabled={!isEditing} rows={4} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="umkmAddress" render={({ field }) => (
                <FormItem>
                  <FormLabel>Alamat Toko</FormLabel>
                  <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid md:grid-cols-2 gap-8">
                <FormField control={form.control} name="umkmEmail" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Toko</FormLabel>
                    <FormControl><Input type="email" {...field} disabled={!isEditing} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="umkmPhoneNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon Toko</FormLabel>
                    <FormControl><Input {...field} disabled={!isEditing} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-medium">Informasi Bank</h3>
                <p className="text-sm text-muted-foreground">Digunakan untuk keperluan transaksi.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                 <FormField control={form.control} name="bankName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Bank</FormLabel>
                    <FormControl><Input {...field} value={field.value ?? ''} disabled={!isEditing} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="bankAccountNumber" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Rekening</FormLabel>
                    <FormControl><Input {...field} value={field.value ?? ''} disabled={!isEditing} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <Button type="button" variant="ghost" onClick={() => {
                      setIsEditing(false);
                      form.reset(profile); // Kembalikan form ke data awal
                    }}>
                      Batal
                    </Button>
                    <Button type="submit" className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Edit Profil Toko
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
