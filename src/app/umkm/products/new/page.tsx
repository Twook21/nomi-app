"use client";

import { useEffect } from "react"; 
import { useRouter } from "next/navigation"; 
import { ProductForm } from "@/components/umkm/ProductForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth"; 
import { Skeleton } from "@/components/ui/skeleton"; 
import { Button } from "@/components/ui/button"; 
import Link from "next/link"; 
import { toast } from "sonner"; 

export default function AddProductPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.replace('/auth/login');
      } else if (user?.role !== 'umkm_owner') {
        toast.info("Anda tidak memiliki akses ke halaman ini.", { description: "Hanya UMKM owner yang dapat menambah produk." });
        router.replace('/profile');
      } else if (user.umkmProfileStatus !== 'verified') {
        toast.info("Profil UMKM Anda belum diverifikasi.", { description: "Mohon tunggu persetujuan admin untuk mengakses fitur ini." });
        router.replace('/profile/pending-verification');
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  if (authLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[500px] w-full" /> 
          </CardContent>
        </Card>
      </div>
    );
  }

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

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl"> 
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