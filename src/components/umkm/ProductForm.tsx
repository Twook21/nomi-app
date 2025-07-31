// File: src/components/umkm/ProductForm.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl, // Pastikan FormControl diimpor
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
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { Product } from "@/types/product";
import type { FoodCategory } from "@/types/category";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

const productFormSchema = z.object({
  productName: z.string().min(3, "Nama produk minimal 3 karakter."),
  description: z.string().min(10, "Deskripsi minimal 10 karakter.").nullable(),
  originalPrice: z.string().min(1, "Harga asli harus diisi.")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "Harga asli harus angka positif."
    }),
  discountedPrice: z.string().min(1, "Harga diskon harus diisi.")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Harga diskon harus angka positif atau nol."
    }),
  stock: z.string().min(1, "Stok harus diisi.")
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 0, {
      message: "Stok harus angka non-negatif."
    }),
  expirationDate: z
    .string()
    .refine((val) => {
        const date = new Date(val);
        return !isNaN(date.getTime()) && date >= new Date(new Date().setHours(0,0,0,0)); 
    }, {
      message: "Tanggal kedaluwarsa tidak valid atau sudah lewat."
    }),
  imageUrl: z.string().url("URL gambar tidak valid.").optional().or(z.literal("")).nullable(),
  categoryId: z.string().min(1, "Anda harus memilih kategori."),
});

interface ProductFormProps {
  initialData?: Product | null;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const { token, logout } = useAuthStore();
  const { isAuthenticated, isLoading: authLoading, authMethod, user } = useAuth();
  const router = useRouter();
  const isEditMode = !!initialData;
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`);
      if (!response.ok) throw new Error("Gagal mengambil data kategori.");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      toast.error("Gagal memuat kategori.", {
          description: error instanceof Error ? error.message : "Terjadi kesalahan server.",
      });
    } finally {
        setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      productName: initialData?.productName || "",
      description: initialData?.description || null,
      originalPrice: String(initialData?.originalPrice || ""),
      discountedPrice: String(initialData?.discountedPrice || ""),
      stock: String(initialData?.stock || ""),
      expirationDate: initialData?.expirationDate
        ? new Date(initialData.expirationDate).toISOString().split("T")[0]
        : "",
      imageUrl: initialData?.imageUrl || null,
      categoryId: initialData?.categoryId || "",
    },
  });

  useEffect(() => {
    if (initialData) {
        form.reset({
            productName: initialData.productName || "",
            description: initialData.description || null,
            originalPrice: String(initialData.originalPrice || ""),
            discountedPrice: String(initialData.discountedPrice || ""),
            stock: String(initialData.stock || ""),
            expirationDate: initialData.expirationDate
                ? new Date(initialData.expirationDate).toISOString().split("T")[0]
                : "",
            imageUrl: initialData.imageUrl || null,
            categoryId: initialData.categoryId || "",
        });
    }
  }, [initialData, form]);

  async function onSubmit(values: z.infer<typeof productFormSchema>) {
    if (!isAuthenticated || !user || user.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified') {
        toast.error("Anda tidak memiliki izin untuk melakukan tindakan ini atau sesi Anda berakhir.");
        logout();
        router.push('/auth/login');
        return;
    }

    const endpoint = isEditMode
      ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/products/${initialData!.id}`
      : `${process.env.NEXT_PUBLIC_API_BASE_URL}/umkm-owners/me/products`;

    const method = isEditMode ? "PUT" : "POST";
    const loadingMessage = isEditMode ? "Memperbarui produk..." : "Menambahkan produk...";
    const successMessage = isEditMode ? "Produk berhasil diperbarui!" : "Produk berhasil ditambahkan!";

    toast.loading(loadingMessage);
    try {
      let headers: HeadersInit = { "Content-Type": "application/json" };
      if (authMethod === 'jwt' && token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(endpoint, {
        method,
        headers,
        credentials: authMethod === 'nextauth' ? 'include' : 'omit',
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
            toast.error("Akses ditolak.", { description: "Sesi Anda berakhir atau Anda tidak memiliki izin." });
            logout();
            router.push('/auth/login');
            return;
        }
        throw new Error(result.message || "Gagal menyimpan produk.");
      }

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

  if (authLoading || isLoadingCategories) {
    return (
        <div className="space-y-8 animate-pulse">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-48" />
        </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'umkm_owner' || user.umkmProfileStatus !== 'verified') {
    return (
        <div className="text-center py-10">
            <h2 className="text-xl font-bold mb-4">Akses Ditolak</h2>
            <p className="text-muted-foreground mb-4">Anda tidak memiliki izin untuk mengakses halaman ini atau profil UMKM Anda belum diverifikasi.</p>
            <Button asChild className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                <Link href="/auth/login">Login / Lihat Dasbor</Link>
            </Button>
        </div>
    );
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
                  {/* Hapus asChild di sini */}
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
                <Textarea placeholder="Jelaskan tentang produk Anda..." {...field} value={field.value || ''} />
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
                  value={field.value || ''}
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