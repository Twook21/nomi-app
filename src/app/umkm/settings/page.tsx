"use client";

import { useState, useEffect, useCallback } from 'react'; // Tambahkan useCallback
import { useAuthStore } from '@/store/auth';
import { useAuth } from '@/hooks/use-auth'; // Import useAuth hook
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
import type { UmkmProfile } from '@/types/umkm_profile'; // Pastikan UmkmProfile type sudah lengkap
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { useRouter } from 'next/navigation'; // Import useRouter
import Link from 'next/link'; // Import Link

// Skema Zod yang sudah diperbaiki
const umkmProfileSchema = z.object({
  umkmName: z.string().min(3, "Nama UMKM minimal 3 karakter."),
  umkmDescription: z.string().nullable().optional(), // Pastikan ini nullable dan optional
  umkmAddress: z.string().min(10, "Alamat UMKM minimal 10 karakter."),
  umkmPhoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit."),
  umkmEmail: z.string().email("Format email tidak valid."),
  bankName: z.string().nullable().optional(),
  bankAccountNumber: z.string().nullable().optional(),
});

// Skeleton untuk halaman pengaturan UMKM
function UmkmSettingsSkeleton() {
    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl space-y-6 animate-pulse">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-0.5 w-full" /> {/* Separator */}
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-56" />
                </CardHeader>
                <CardContent className="space-y-8">
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
                    <div className="flex justify-end gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


export default function UmkmSettingsPage() {
  const router = useRouter();
  // Gunakan useAuth hook untuk status otentikasi terpadu
  const { user, isAuthenticated, isLoading: authLoading, authMethod } = useAuth();
  // Ambil token dan logout dari useAuthStore
  const { token, logout } = useAuthStore();

  const [profile, setProfile] = useState<UmkmProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof umkmProfileSchema>>({
    resolver: zodResolver(umkmProfileSchema),
    defaultValues: {
        umkmName: "",
        umkmDescription: null, // Default ke null
        umkmAddress: "",
        umkmPhoneNumber: "",
        umkmEmail: "",
        bankName: null, // Default ke null
        bankAccountNumber: null, // Default ke null
    },
  });

  const fetchProfile = useCallback(async () => {
    // Hanya fetch jika sudah terautentikasi dan merupakan UMKM owner
    if (!isAuthenticated || !user || user.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      let headers: HeadersInit = {};
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me`, {
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast.error("Akses ditolak.", { description: "Anda tidak memiliki izin untuk melihat profil UMKM atau sesi Anda berakhir." });
          logout();
          router.push('/auth/login');
          return;
        } else if (response.status === 404) {
            toast.error("Profil UMKM tidak ditemukan.", { description: "Silakan daftar sebagai mitra UMKM." });
            router.replace('/profile/become-partner'); // Redirect jika profil tidak ditemukan
            return;
        }
        throw new Error((await response.json()).message || "Gagal mengambil profil UMKM.");
      }
      const result = await response.json();
      setProfile(result);
      // PERBAIKAN: Menyesuaikan data untuk form.reset (menggunakan nullish coalescing)
      form.reset({
        umkmName: result.umkmName || "",
        umkmDescription: result.umkmDescription || null,
        umkmAddress: result.umkmAddress || "",
        umkmPhoneNumber: result.umkmPhoneNumber || "",
        umkmEmail: result.umkmEmail || "",
        bankName: result.bankName || null,
        bankAccountNumber: result.bankAccountNumber || null,
      });
    } catch (error) {
      toast.error("Gagal memuat profil.", { description: error instanceof Error ? error.message : "Terjadi kesalahan." });
      setProfile(null); // Set profile to null on error
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, authMethod, token, form, router, logout]); // Tambahkan semua dependencies

  useEffect(() => {
    // Panggil fetchProfile hanya jika status autentikasi sudah selesai dimuat
    if (!authLoading) {
        if (!isAuthenticated) {
            router.replace('/auth/login');
        } else if (user?.role !== 'umkm_owner') {
            toast.info("Anda tidak memiliki akses ke halaman ini.", { description: "Hanya UMKM owner yang dapat mengelola pengaturan toko." });
            router.replace('/profile');
        } else if (user.umkmProfileStatus !== 'verified') {
            toast.info("Profil UMKM Anda belum diverifikasi.", { description: "Mohon tunggu persetujuan admin untuk mengakses fitur ini." });
            router.replace('/profile/pending-verification');
        }
        else {
            fetchProfile();
        }
    }
  }, [authLoading, isAuthenticated, user, router, fetchProfile]);

  const onSubmit = async (values: z.infer<typeof umkmProfileSchema>) => {
    // Cek otorisasi lagi sebelum update
    if (!isAuthenticated || !user || user.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified') {
        toast.error("Tidak dapat menyimpan perubahan. Sesi berakhir atau Anda tidak memiliki izin.");
        logout();
        router.push('/auth/login');
        return;
    }

    toast.loading("Menyimpan perubahan...");
    try {
      let headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me`, {
        method: 'PUT',
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
              toast.error("Akses ditolak.", { description: "Sesi Anda berakhir atau Anda tidak memiliki izin." });
              logout();
              router.push('/auth/login');
              return;
          } else if (response.status === 404) {
              toast.error("Profil UMKM tidak ditemukan.", { description: "Terjadi kesalahan saat memperbarui profil." });
              return;
          }
          throw new Error(result.message || "Gagal memperbarui profil.");
      }
      
      setProfile(result.umkm); // Update state dengan data terbaru
      toast.success("Profil toko berhasil diperbarui!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Gagal menyimpan.", { description: error instanceof Error ? error.message : "Terjadi kesalahan." });
    }
  };

  // Tampilkan loading skeleton jika sedang loading auth atau data
  if (authLoading || isLoading) {
    return <UmkmSettingsSkeleton />;
  }

  // Tampilkan pesan jika tidak terautentikasi (setelah loading selesai)
  if (!isAuthenticated) {
    return (
        <div className="container mx-auto py-8 px-4">
            <div className="text-center">
                <p className="text-muted-foreground">Silakan login untuk mengakses pengaturan toko Anda.</p>
                <Button asChild className="mt-4 bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                    <Link href="/auth/login">Login</Link>
                </Button>
            </div>
        </div>
    );
  }

  // Tampilkan pesan jika user bukan UMKM owner atau belum terverifikasi
  if (user?.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified') {
      return (
          <div className="container mx-auto py-8 px-4">
              <div className="text-center">
                  <p className="text-muted-foreground">Anda tidak memiliki izin untuk melihat pengaturan UMKM atau profil Anda belum diverifikasi.</p>
                  <Button asChild className="mt-4 bg-gray-200 text-gray-800 hover:bg-gray-300">
                      <Link href={user?.umkmProfileStatus === 'pending' ? '/profile/pending-verification' : '/profile'}>
                          {user?.umkmProfileStatus === 'pending' ? 'Lihat Status Verifikasi' : 'Kembali ke Dasbor Pelanggan'}
                      </Link>
                  </Button>
                  {user?.role === 'customer' && !user.umkmProfileStatus && (
                      <Button asChild className="mt-2 bg-nimo-yellow text-white hover:bg-nimo-yellow/90 ml-2">
                          <Link href="/profile/become-partner">Daftar sebagai Mitra UMKM</Link>
                      </Button>
                  )}
              </div>
          </div>
      );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl"> {/* Tambahkan container */}
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
                    <FormControl><Textarea {...field} disabled={!isEditing} rows={4} value={field.value || ''} /></FormControl> {/* Handle null */}
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
                        // Reset form ke data awal (pastikan profile tidak null)
                        if (profile) {
                            form.reset({
                                umkmName: profile.umkmName || "",
                                umkmDescription: profile.umkmDescription || null,
                                umkmAddress: profile.umkmAddress || "",
                                umkmPhoneNumber: profile.umkmPhoneNumber || "",
                                umkmEmail: profile.umkmEmail || "",
                                bankName: profile.bankName || null,
                                bankAccountNumber: profile.bankAccountNumber || null,
                            });
                        }
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
    </div>
  );
}