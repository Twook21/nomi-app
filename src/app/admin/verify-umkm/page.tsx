"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/umkm/ProductDataTable"; // Re-use the data table component
import { getVerificationColumns } from "@/components/admin/VerificationTableColumns";
import type { AdminUmkmProfile } from "@/types/admin_umkm";

export default function VerifyUmkmPage() {
  const { token } = useAuthStore();
  const [umkmList, setUmkmList] = useState<AdminUmkmProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUnverifiedUmkm = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/umkm-owners?isVerified=false`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal mengambil data UMKM.");
      
      const result = await response.json();
      setUmkmList(result || []);
    } catch (error) {
      toast.error("Gagal memuat data UMKM", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan server."
      });
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUnverifiedUmkm();
  }, [fetchUnverifiedUmkm]);

  const handleVerification = (verifiedUmkmId: string) => {
    setUmkmList(currentList => currentList.filter(u => u.id !== verifiedUmkmId));
  };

  const columns = getVerificationColumns(handleVerification);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Verifikasi Mitra UMKM</h1>
        <p className="text-muted-foreground">Setujui atau tolak pendaftaran mitra UMKM baru.</p>
      </div>
      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <div className="text-center p-8 text-muted-foreground">Memuat data pendaftar...</div>
          ) : (
            <DataTable columns={columns} data={umkmList} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
