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
import type { Product } from "@/types/product";

interface DeleteProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSuccess: () => void;
}

export function DeleteProductDialog({ isOpen, onOpenChange, product, onSuccess }: DeleteProductDialogProps) {
  const { token } = useAuthStore();

  const handleDelete = async () => {
    toast.loading("Menghapus produk...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products/${product.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal menghapus produk.");
      toast.success(`Produk "${product.productName}" berhasil dihapus.`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Gagal menghapus produk.", { description: error instanceof Error ? error.message : "" });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Peringatan!</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini tidak dapat diurungkan dan akan menghapus produk <span className="font-semibold">{product.productName}</span> secara permanen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Ya, Hapus Permanen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}