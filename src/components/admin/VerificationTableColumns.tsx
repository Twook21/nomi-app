"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { AdminUmkmProfile } from "@/types/admin_umkm";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("id-ID", {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

const TableActions = ({ umkm, onVerified }: { umkm: AdminUmkmProfile, onVerified: (umkmId: string) => void }) => {
  const { token } = useAuthStore();
  const { authMethod } = useAuth();

  const handleVerification = async (isVerified: boolean) => {
    const action = isVerified ? "menyetujui" : "menolak";
    toast.loading(`Sedang ${action} ${umkm.umkmName}...`);
    
    try {
      // PERBAIKAN: Support dual auth
      let headers: HeadersInit = { 'Content-Type': 'application/json' };
      let credentials: RequestCredentials = 'omit';

      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else if (authMethod === 'nextauth') {
        credentials = 'include';
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/umkm-owners/${umkm.id}/verify`, {
        method: 'PUT',
        headers,
        credentials,
        body: JSON.stringify({ isVerified }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || `Gagal ${action} UMKM.`);
      }

      const result = await response.json();
      
      toast.success(`UMKM "${umkm.umkmName}" telah berhasil di${action}.`, {
        description: isVerified 
          ? "User role telah diupdate ke UMKM Owner dan akan ter-refresh saat login berikutnya."
          : "Profil UMKM telah dihapus dan user role dikembalikan ke Customer."
      });
      
      onVerified(umkm.id);
      
      // TAMBAHKAN: Log untuk debugging
      console.log(`UMKM ${action} result:`, result);
      
    } catch (error) {
      toast.error(`Gagal ${action} UMKM.`, {
        description: error instanceof Error ? error.message : "Terjadi kesalahan server.",
      });
    }
  };

  return (
    <div className="flex gap-2 justify-end">
      <Button 
        variant="outline" 
        size="sm" 
        className="bg-green-500 text-white hover:bg-green-600" 
        onClick={() => handleVerification(true)}
      >
        <Check className="h-4 w-4 mr-1" /> Setujui
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => handleVerification(false)}
      >
        <X className="h-4 w-4 mr-1" /> Tolak
      </Button>
    </div>
  );
};

export const getVerificationColumns = (onVerified: (umkmId: string) => void): ColumnDef<AdminUmkmProfile>[] => [
  {
    accessorKey: "umkmName",
    header: "Nama UMKM",
  },
  {
    accessorKey: "user.username",
    header: "Username Pemilik",
  },
  {
    accessorKey: "user.email",
    header: "Email Pemilik", 
  },
  {
    accessorKey: "umkmAddress",
    header: "Alamat",
    cell: ({ row }) => {
      const address = row.original.umkmAddress || '';
      return (
        <div className="max-w-xs truncate" title={address}>
          {address}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal Daftar",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => <TableActions umkm={row.original} onVerified={onVerified} />,
  },
];