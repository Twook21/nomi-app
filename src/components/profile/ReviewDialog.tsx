"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const reviewSchema = z.object({
  rating: z.number().min(1, "Rating tidak boleh kosong."),
  comment: z.string().optional(),
});

// =================================================================
// PERUBAHAN: Menambahkan 'initialData' untuk mode edit.
// =================================================================
interface ReviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string;
  productName: string;
  onSuccess: () => void;
  initialData?: {
    rating: number;
    comment?: string | null;
  } | null;
}

export function ReviewDialog({ isOpen, onOpenChange, productId, productName, onSuccess, initialData }: ReviewDialogProps) {
  const { token } = useAuthStore();
  const [hoverRating, setHoverRating] = useState(0);
  const isEditMode = !!initialData;

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      comment: initialData?.comment || "",
    },
  });

  // PERUBAHAN: Reset form saat dialog dibuka/data berubah
  useEffect(() => {
    if (isOpen) {
      form.reset({
        rating: initialData?.rating || 0,
        comment: initialData?.comment || "",
      });
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    const toastId = toast.loading(isEditMode ? "Memperbarui ulasan..." : "Mengirim ulasan...");
    try {
      // PERUBAHAN: Gunakan metode PUT untuk mode edit, POST untuk mode buat
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || (isEditMode ? "Gagal memperbarui ulasan." : "Gagal mengirim ulasan."));

      toast.success(result.message || (isEditMode ? "Ulasan berhasil diperbarui!" : "Ulasan berhasil dikirim!"), { id: toastId });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error(isEditMode ? "Gagal memperbarui ulasan." : "Gagal mengirim ulasan.", {
        id: toastId,
        description: error instanceof Error ? error.message : "Terjadi kesalahan.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Ulasan" : "Beri Ulasan"} untuk {productName}</DialogTitle>
          <DialogDescription>Bagikan pengalaman Anda dengan produk ini.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="rating" render={({ field }) => (
              <FormItem>
                <FormLabel>Rating Anda</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-8 w-8 cursor-pointer transition-colors",
                          (hoverRating || field.value) >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground"
                        )}
                        onClick={() => field.onChange(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="comment" render={({ field }) => (
              <FormItem>
                <FormLabel>Komentar (Opsional)</FormLabel>
                <FormControl><Textarea placeholder="Ceritakan lebih lanjut..." {...field} value={field.value || ''} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (isEditMode ? "Menyimpan..." : "Mengirim...") : (isEditMode ? "Simpan Perubahan" : "Kirim Ulasan")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
