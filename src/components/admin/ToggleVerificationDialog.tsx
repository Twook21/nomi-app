"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import type { AdminUmkmProfile } from "@/types/admin_umkm";
import { cn } from "@/lib/utils"; 

interface ToggleVerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  umkm: AdminUmkmProfile;
  onSuccess: () => void;
}

export function ToggleVerificationDialog({ isOpen, onOpenChange, umkm, onSuccess }: ToggleVerificationDialogProps) {
  const { token } = useAuthStore();
  const action = umkm.isVerified ? "menonaktifkan" : "mengaktifkan";
  const newStatus = !umkm.isVerified;

  const handleToggle = async () => {
    toast.loading(`Sedang ${action} ${umkm.umkmName}...`);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/umkm-owners/${umkm.id}/verify`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isVerified: newStatus }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || `Gagal ${action} UMKM.`);
      }

      toast.success(`Mitra "${umkm.umkmName}" telah berhasil di${action}.`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Gagal ${action} UMKM.`, {
        description: error instanceof Error ? error.message : "Terjadi kesalahan server.",
      });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan {action} mitra <span className="font-semibold">{umkm.umkmName}</span>.
            {newStatus === false && " Mitra ini tidak akan bisa menjual produk lagi."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleToggle} 
            className={cn(newStatus === false && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
          >
            Ya, {action.charAt(0).toUpperCase() + action.slice(1)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}