"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import type { FoodCategory } from "@/types/category";

// == FIX 1: Skema validasi untuk categoryId diperbaiki ==
const productFormSchema = z.object({
  productName: z.string().min(3, "Nama produk minimal 3 karakter."),
  description: z.string().min(10, "Deskripsi minimal 10 karakter."),
  originalPrice: z.string().min(1, "Harga asli harus diisi."),
  discountedPrice: z.string().min(1, "Harga diskon harus diisi."),
  stock: z.string().min(1, "Stok harus diisi."),
  expirationDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Format tanggal tidak valid.",
    }),
  imageUrl: z.string().url("URL gambar tidak valid.").optional().or(z.literal("")),
  // Menggunakan .min(1, ...) untuk pesan error wajib diisi
  categoryId: z.string().min(1, "Anda harus memilih kategori."),
});

interface ProductFormProps {
  initialData?: Product | null;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const { token } = useAuthStore();
  const router = useRouter();
  const isEditMode = !!initialData;
  const [categories, setCategories] = useState<FoodCategory[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`
        );
        if (!response.ok) throw new Error("Gagal mengambil data kategori.");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        toast.error("Gagal memuat kategori.", {
            description: error instanceof Error ? error.message : "Terjadi kesalahan server.",
        });
      }
    };
    fetchCategories();
  }, []);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: initialData?.productName || "",
      description: initialData?.description || "",
      originalPrice: String(initialData?.originalPrice || ""),
      discountedPrice: String(initialData?.discountedPrice || ""),
      stock: String(initialData?.stock || ""),
      expirationDate: initialData?.expirationDate
        ? new Date(initialData.expirationDate).toISOString().split("T")[0]
        : "",
      imageUrl: initialData?.imageUrl || "",
      categoryId: initialData?.categoryId || "",
    },
  });

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    const endpoint = isEditMode
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/products/${
          initialData!.id
        }`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/products`;

    const method = isEditMode ? "PUT" : "POST";
    const loadingMessage = isEditMode
      ? "Memperbarui produk..."
      : "Menambahkan produk...";
    const successMessage = isEditMode
      ? "Produk berhasil diperbarui!"
      : "Produk berhasil ditambahkan!";

    toast.loading(loadingMessage);
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal menyimpan produk.");

      toast.success(successMessage);
      router.push("/umkm/products");
      router.refresh();
    } catch (error) {
      toast.error("Gagal menyimpan produk.", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan server.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="productName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Produk</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Roti Tawar Spesial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori Produk</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Produk</FormLabel>
              <FormControl>
                <Textarea placeholder="Jelaskan tentang produk Anda..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Asli (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="20000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discountedPrice"
            render={({ field }) => (
              // == FIX 2: Tag penutup diperbaiki dari </Item> menjadi </FormItem> ==
              <FormItem>
                <FormLabel>Harga Diskon (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="15000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stok</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expirationDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal Kedaluwarsa</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL Gambar Produk</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/gambar.jpg"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Menyimpan..."
            : isEditMode
            ? "Simpan Perubahan"
            : "Simpan Produk"}
        </Button>
      </form>
    </Form>
  );
}