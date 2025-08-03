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
import { useAuth } from "@/hooks/use-auth"; 
import { toast } from "sonner";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation"; 

const reviewSchema = z.object({
  rating: z.number().min(1, "Rating tidak boleh kosong."),
  comment: z.string().optional(),
});

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
  const { isAuthenticated, authMethod } = useAuth();
  const { token, logout } = useAuthStore();
  const router = useRouter(); 
  const [hoverRating, setHoverRating] = useState(0);
  const isEditMode = !!initialData;

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: initialData?.rating || 0,
      comment: initialData?.comment || "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        rating: initialData?.rating || 0,
        comment: initialData?.comment || "",
      });
      setHoverRating(initialData?.rating || 0);
    }
  }, [isOpen, initialData, form]);

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    if (!isAuthenticated) {
        toast.error("Anda harus login untuk mengirim ulasan.", {
            action: {
                label: "Login",
                onClick: () => {
                    onOpenChange(false); 
                    router.push('/auth/login');
                },
            },
        });
        return;
    }

    const toastId = toast.loading(isEditMode ? "Memperbarui ulasan..." : "Mengirim ulasan...");
    try {
      let headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: isEditMode ? 'PUT' : 'POST',
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
        body: JSON.stringify(values),
      });
      
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
            toast.error("Sesi Anda berakhir. Silakan login kembali.", { id: toastId });
            logout();
            router.push('/auth/login');
            return;
        }
        throw new Error(result.message || (isEditMode ? "Gagal memperbarui ulasan." : "Gagal mengirim ulasan."));
      }

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
                        onClick={() => { field.onChange(star); setHoverRating(star); }} // Set hoverRating juga
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