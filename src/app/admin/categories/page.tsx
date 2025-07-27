"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/umkm/ProductDataTable";
import { getCategoryColumns } from "@/components/admin/CategoryTableColumns";
import type { AdminFoodCategory } from "@/types/admin_category";
import { Button } from "@/components/ui/button";
import { PlusCircle, Tags, Star, XCircle, Search } from "lucide-react";
import { CategoryFormDialog } from "@/components/admin/CategoryFormDialog";
import { Input } from "@/components/ui/input";

interface CategoryStats {
  totalCategories: number;
  popularCategoryName: string | null;
  emptyCategories: number;
}

export default function ManageCategoriesPage() {
  const { token } = useAuthStore();
  const [categories, setCategories] = useState<AdminFoodCategory[]>([]);
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({ search: searchTerm });
      const [listRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/categories?${queryParams.toString()}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/category-stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (!listRes.ok || !statsRes.ok) throw new Error("Gagal mengambil data kategori.");
      
      setCategories(await listRes.json());
      setStats(await statsRes.json());
    } catch (error) {
      toast.error("Gagal memuat data", { description: error instanceof Error ? error.message : ""});
    } finally {
      setIsLoading(false);
    }
  }, [token, searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => { fetchData(); }, 500);
    return () => clearTimeout(handler);
  }, [fetchData]);

  const handleSuccess = () => {
    fetchData(); 
  };

  const columns = getCategoryColumns(handleSuccess);

  return (
    <>
      <CategoryFormDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={handleSuccess}
      />
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Kategori</CardTitle>
                    <Tags className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats?.totalCategories ?? '...'}</div></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Kategori Terpopuler</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold truncate">{stats?.popularCategoryName ?? '-'}</div></CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Kategori Kosong</CardTitle>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats?.emptyCategories ?? '...'}</div></CardContent>
            </Card>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Daftar Kategori</CardTitle>
                </div>
                <Button className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90" onClick={() => setIsDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Tambah Kategori
                </Button>
            </div>
            <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Cari nama kategori..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center p-8 text-muted-foreground">Memuat data kategori...</div>
            ) : (
              <DataTable columns={columns} data={categories} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}