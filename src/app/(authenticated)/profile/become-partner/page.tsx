"use client";

import { BecomePartnerForm } from "@/components/profile/BecomePartnerForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth"; // Import useAuth hook
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton for loading state

export default function BecomePartnerPage() {
    // Gunakan useAuth hook untuk status otentikasi terpadu
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // Jika pengguna sudah menjadi UMKM_OWNER (terverifikasi) atau memiliki profil UMKM yang pending,
    // arahkan ke dasbor mereka atau halaman pending.
    useEffect(() => {
        if (!authLoading && user) {
            // Jika sudah UMKM owner yang terverifikasi
            if (user.role === 'umkm_owner' && user.umkmProfileStatus === 'verified') {
                router.replace('/umkm/products');
            } 
            // Jika sudah ada UMKM profile tapi masih pending
            else if (user.umkmProfileStatus === 'pending') {
                router.replace('/profile/pending-verification');
            }
        }
    }, [user, router, authLoading]);

    // Tampilkan loading skeleton jika sedang loading auth
    if (authLoading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-3xl">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[500px] w-full" /> {/* Skeleton untuk form */}
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Tampilkan pesan atau redirect jika belum terautentikasi atau sudah menjadi UMKM
    if (!isAuthenticated || !user) {
        // Ini akan di-handle oleh BecomePartnerForm atau redirect oleh useEffect di atas
        return null;
    }

    // Menampilkan form jika user adalah customer dan belum memiliki profil UMKM pending/verified
    // Logika ini sudah di-handle di useEffect di atas (redirect jika sudah UMKM)
    // Jadi jika sampai sini, berarti user adalah customer dan belum punya UMKM.
    return (
        <div className="container mx-auto py-8 px-4 max-w-3xl">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Bergabung Menjadi Mitra UMKM</CardTitle>
                    <CardDescription>
                        Buka toko Anda di Nomi dan jangkau lebih banyak pelanggan. Isi formulir di bawah ini untuk memulai.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <BecomePartnerForm />
                </CardContent>
            </Card>
        </div>
    );
}