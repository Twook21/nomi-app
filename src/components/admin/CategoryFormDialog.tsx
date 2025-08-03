"use client";

import { useEffect } from "react"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import type { FoodCategory } from "@/types/category";

const categorySchema = z.object({
  categoryName: z.string().min(3, "Nama kategori minimal 3 karakter."),
});

interface CategoryFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  category?: FoodCategory | null;
  onSuccess: () => void;
}

export function CategoryFormDialog({ isOpen, onOpenChange, category, onSuccess }: CategoryFormDialogProps) {
  const { token } = useAuthStore();
  const isEditMode = !!category;

  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryName: category?.categoryName || "",
    },
  });
  
  useEffect(() => {
    form.reset({ categoryName: category?.categoryName || "" });
  }, [category, form]);

  const onSubmit = async (values: z.infer<typeof categorySchema>) => {
    const endpoint = isEditMode ? `/api/admin/categories/${category!.id}` : '/api/admin/categories';
    const method = isEditMode ? 'PUT' : 'POST';
    const loadingMessage = isEditMode ? 'Memperbarui...' : 'Menambahkan...';
    const successMessage = isEditMode ? 'Kategori diperbarui!' : 'Kategori ditambahkan!';

    toast.loading(loadingMessage);
    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Gagal menyimpan kategori.");
      toast.success(successMessage);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Gagal menyimpan.", { description: error instanceof Error ? error.message : "" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Kategori' : 'Tambah Kategori Baru'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Ubah nama kategori di bawah ini.' : 'Masukkan nama untuk kategori baru.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="categoryName" render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Kategori</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}