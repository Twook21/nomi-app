"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/umkm/ProductDataTable";
import { getUserColumns } from "@/components/admin/UserTableColumns";
import type { AdminUser } from "@/types/admin_user";
import { Users, User, Store, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface UserStats {
  totalUsers: number;
  customerCount: number;
  umkmCount: number;
}
interface GrowthData { month: string; total: number; }

export default function ManageUsersPage() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [growthData, setGrowthData] = useState<GrowthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        role: filter === 'all' ? '' : filter,
        search: searchTerm,
      });
      const [listRes, statsRes, growthRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users?${queryParams.toString()}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user-stats`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/user-growth-data`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (!listRes.ok || !statsRes.ok || !growthRes.ok) throw new Error("Gagal mengambil data pengguna.");
      
      const listData = await listRes.json();
      setUsers(listData.users || []);
      setStats(await statsRes.json());
      setGrowthData(await growthRes.json());
    } catch (error) {
      toast.error("Gagal memuat data", { description: error instanceof Error ? error.message : "" });
    } finally {
      setIsLoading(false);
    }
  }, [token, filter, searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
        fetchData();
    }, 500);
    return () => clearTimeout(handler);
  }, [fetchData]);

  const handleSuccess = () => {
    fetchData(); 
  };

  const columns = getUserColumns(handleSuccess);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pengguna</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.totalUsers ?? '...'}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Customer</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.customerCount ?? '...'}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jumlah Mitra UMKM</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.umkmCount ?? '...'}</div></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Analisa Pertumbuhan Pengguna</CardTitle>
        </CardHeader>
        <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={growthData}>
                    <XAxis dataKey="month" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} />
                    <Bar dataKey="total" fill="var(--nimo-yellow)" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Daftar Pengguna</CardTitle>
            <div className="flex items-center gap-4 pt-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Cari berdasarkan nama, username, atau email..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-2 flex-wrap">
                    <span className="text-sm font-medium self-center">Filter Peran:</span>
                    <Button size="sm" variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>Semua</Button>
                    <Button size="sm" variant={filter === 'customer' ? 'default' : 'outline'} onClick={() => setFilter('customer')}>Customer</Button>
                    <Button size="sm" variant={filter === 'umkm_owner' ? 'default' : 'outline'} onClick={() => setFilter('umkm_owner')}>UMKM</Button>
                </div>
            </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-8 text-muted-foreground">Memuat data pengguna...</div>
          ) : (
            <DataTable columns={columns} data={users} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}