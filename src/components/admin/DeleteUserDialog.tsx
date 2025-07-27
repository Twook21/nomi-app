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

interface DeleteUserDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  username: string;
  onSuccess: () => void;
}

export function DeleteUserDialog({
  isOpen,
  onOpenChange,
  userId,
  username,
  onSuccess,
}: DeleteUserDialogProps) {
  const { token } = useAuthStore();

  const handleDelete = async () => {
    toast.loading("Menghapus pengguna...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Gagal menghapus pengguna.");
      }

      toast.success(`Pengguna "${username}" berhasil dihapus.`);
      onSuccess();
    } catch (error) {
      toast.error("Gagal menghapus pengguna.", {
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
            Tindakan ini tidak dapat diurungkan. Ini akan menghapus pengguna
            <span className="font-semibold"> {username} </span>
            secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Ya, Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}