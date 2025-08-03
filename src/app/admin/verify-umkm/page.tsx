"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/umkm/ProductDataTable";
import { getVerificationColumns } from "@/components/admin/VerificationTableColumns";
import type { AdminUmkmProfile } from "@/types/admin_umkm";

export default function VerifyUmkmPage() {
  const { token } = useAuthStore();
  const { authMethod } = useAuth();
  const [umkmList, setUmkmList] = useState<AdminUmkmProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUnverifiedUmkm = useCallback(async () => {
    setIsLoading(true);
    try {
      let headers: HeadersInit = { 'Content-Type': 'application/json' };
      let credentials: RequestCredentials = 'omit';

      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (authMethod === 'nextauth') {
        credentials = 'include';
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/umkm-owners?isVerified=false`, {
        headers,
        credentials,
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Session expired. Please login again.");
          return;
        }
        throw new Error("Gagal mengambil data UMKM.");
      }
      
      const result = await response.json();
      setUmkmList(result || []);
    } catch (error) {
      toast.error("Gagal memuat data UMKM", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan server."
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, authMethod]);

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
          ) : umkmList.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground">Tidak ada UMKM yang menunggu verifikasi.</div>
          ) : (
            <DataTable columns={columns} data={umkmList} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}