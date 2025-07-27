"use client";

import { BecomePartnerForm } from "@/components/profile/BecomePartnerForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function BecomePartnerPage() {
    const { user } = useAuthStore();
    const router = useRouter();

    // Jika pengguna sudah menjadi UMKM, arahkan ke dasbor mereka
    useEffect(() => {
        if (user?.role === 'umkm_owner') {
            router.replace('/umkm/products');
        }
    }, [user, router]);

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