"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminUserDetail } from "@/types/admin_user_detail";
import { Mail, Phone, Home, ShoppingCart, DollarSign } from "lucide-react";
import { DataTable } from "@/components/umkm/ProductDataTable"; // Pastikan path ini sesuai
import { getUserOrderColumns } from "@/components/admin/UserOrderDetailColumns"; // Pastikan path ini sesuai

// --- HELPER FUNCTIONS ---
function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("id-ID", { dateStyle: 'long', timeStyle: 'short' });
}
function formatRupiah(amount: number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

// --- SKELETON COMPONENT ---
function UserDetailSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/3 mt-2" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="md:col-span-2 h-96 w-full" />
            </div>
        </div>
    );
}

// --- MAIN COMPONENT ---
export default function UserDetailPage() {
    const params = useParams();
    const { token } = useAuthStore();
    const [user, setUser] = useState<AdminUserDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const userId = params.id as string;

    useEffect(() => {
        if (!token || !userId) return;
        const fetchUserDetail = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Gagal mengambil detail pengguna.");
                const result = await response.json();
                setUser(result);
            } catch (error) {
                toast.error("Gagal memuat detail.", { description: error instanceof Error ? error.message : "" });
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserDetail();
    }, [token, userId]);

    if (isLoading) return <UserDetailSkeleton />;
    if (!user) return <div className="p-8 text-center">Pengguna tidak ditemukan.</div>;

    // Inisialisasi kolom untuk DataTable
    const orderColumns = getUserOrderColumns();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-muted-foreground">Detail profil dan aktivitas pengguna.</p>
            </div>

            {/* --- KARTU STATISTIK BARU --- */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Belanja</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{formatRupiah(Number(user.stats.totalSpending))}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Jumlah Pesanan</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{user.stats.totalOrders}</div></CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader><CardTitle>Informasi Pengguna</CardTitle></CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><span>{user.email}</span></div>
                        <div className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><span>{user.phoneNumber || '-'}</span></div>
                        <div className="flex items-center gap-3"><Home className="h-4 w-4 text-muted-foreground" /><span>{user.address || '-'}</span></div>
                    </CardContent>
                </Card>
                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>Riwayat Pesanan</CardTitle></CardHeader>
                    <CardContent>
                        {/* --- PENGGUNAAN DATATABLE BARU --- */}
                        <DataTable columns={orderColumns} data={user.orders} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}