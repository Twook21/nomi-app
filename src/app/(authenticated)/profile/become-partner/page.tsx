"use client";

import { BecomePartnerForm } from "@/components/profile/BecomePartnerForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth"; 
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton"; 

export default function BecomePartnerPage() {
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && user) {
            if (user.role === 'umkm_owner' && user.umkmProfileStatus === 'verified') {
                router.replace('/umkm/products');
            } 
            else if (user.umkmProfileStatus === 'pending') {
                router.replace('/profile/pending-verification');
            }
        }
    }, [user, router, authLoading]);

    if (authLoading) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-3xl">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-64 mb-2" />
                        <Skeleton className="h-4 w-96" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-[500px] w-full" /> 
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }


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