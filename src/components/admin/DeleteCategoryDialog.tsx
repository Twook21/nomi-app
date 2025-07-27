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
import type { FoodCategory } from "@/types/category";

interface DeleteCategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category: FoodCategory;
  onSuccess: () => void;
}

export function DeleteCategoryDialog({ isOpen, onOpenChange, category, onSuccess }: DeleteCategoryDialogProps) {
  const { token } = useAuthStore();

  const handleDelete = async () => {
    toast.loading("Menghapus kategori...");
    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal menghapus kategori.");
      toast.success(`Kategori "${category.categoryName}" berhasil dihapus.`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Gagal menghapus.", { description: error instanceof Error ? error.message : "Pastikan tidak ada produk yang menggunakan kategori ini." });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan menghapus kategori <span className="font-semibold">{category.categoryName}</span> secara permanen.
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