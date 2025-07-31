"use client";

import { useEffect } from "react"; // Tambahkan useEffect
import { useRouter } from "next/navigation"; // Import useRouter
import { ProductForm } from "@/components/umkm/ProductForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Button } from "@/components/ui/button"; // Import Button
import Link from "next/link"; // Import Link
import { toast } from "sonner"; // Import toast

export default function AddProductPage() {
  const router = useRouter();
  // Gunakan useAuth hook untuk status otentikasi terpadu
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Efek untuk menangani pengalihan berdasarkan status autentikasi dan peran
  useEffect(() => {
    // Hanya lakukan pengecekan setelah status autentikasi selesai dimuat
    if (!authLoading) {
      if (!isAuthenticated) {
        // Jika tidak terautentikasi, alihkan ke halaman login
        router.replace('/auth/login');
      } else if (user?.role !== 'umkm_owner') {
        // Jika user login tapi bukan UMKM owner, berikan pesan dan alihkan ke dasbor pelanggan
        toast.info("Anda tidak memiliki akses ke halaman ini.", { description: "Hanya UMKM owner yang dapat menambah produk." });
        router.replace('/profile');
      } else if (user.umkmProfileStatus !== 'verified') {
        // Jika user adalah UMKM owner tapi belum terverifikasi, berikan pesan dan alihkan ke halaman pending
        toast.info("Profil UMKM Anda belum diverifikasi.", { description: "Mohon tunggu persetujuan admin untuk mengakses fitur ini." });
        router.replace('/profile/pending-verification');
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Tampilkan loading skeleton jika sedang memuat status autentikasi
  if (authLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[500px] w-full" /> {/* Skeleton untuk form */}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Tampilkan pesan "Akses Ditolak" jika tidak terautentikasi atau tidak memiliki izin
  if (!isAuthenticated || user?.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified') {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Akses Ditolak</h2>
          <p className="text-muted-foreground mb-4">Anda tidak memiliki izin untuk mengakses halaman ini atau profil UMKM Anda belum diverifikasi.</p>
          <Button asChild className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
            <Link href="/auth/login">Login / Lihat Dasbor</Link>
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

  // Render ProductForm jika semua kriteria terpenuhi
  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl"> {/* Tambahkan container */}
      <Card>
        <CardHeader>
          <CardTitle>Tambah Produk Baru</CardTitle>
          <CardDescription>Isi detail produk yang ingin Anda jual.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm />
        </CardContent>
      </Card>
    </div>
  );
}