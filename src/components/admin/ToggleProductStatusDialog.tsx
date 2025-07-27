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
import { cn } from "@/lib/utils";

interface ToggleProductStatusDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  onSuccess: () => void;
}

export function ToggleProductStatusDialog({ isOpen, onOpenChange, product, onSuccess }: ToggleProductStatusDialogProps) {
  const { token } = useAuthStore();
  const action = product.isAvailable ? "menonaktifkan" : "mengaktifkan";
  const newStatus = !product.isAvailable;

  const handleToggle = async () => {
    toast.loading(`Sedang ${action} produk...`);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isAvailable: newStatus }),
      });
      if (!response.ok) throw new Error(`Gagal ${action} produk.`);
      toast.success(`Produk berhasil di${action}.`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(`Gagal ${action} produk.`, { description: error instanceof Error ? error.message : "" });
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan {action} produk <span className="font-semibold">{product.productName}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggle} className={cn(newStatus === false && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}>
            Ya, {action.charAt(0).toUpperCase() + action.slice(1)}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}