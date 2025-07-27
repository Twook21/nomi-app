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

interface DeleteProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  onSuccess: () => void;
}

export function DeleteProductDialog({
  isOpen,
  onOpenChange,
  productId,
  productName,
  onSuccess,
}: DeleteProductDialogProps) {
  const { token } = useAuthStore();

  const handleDelete = async () => {
    toast.loading("Menghapus produk...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Gagal menghapus produk.");
      }

      toast.success(`Produk "${productName}" berhasil dihapus.`);
      onSuccess();
    } catch (error) {
      toast.error("Gagal menghapus produk.", {
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
            Tindakan ini tidak dapat diurungkan. Ini akan menghapus produk
            <span className="font-semibold"> {productName} </span>
            secara permanen dari server.
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
