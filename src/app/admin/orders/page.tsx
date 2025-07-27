"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/umkm/ProductDataTable";
import { getAdminOrderColumns } from "@/components/admin/AdminOrderTableColumns";
import type { AdminOrder } from "@/types/admin_order";
import { ShoppingCart, DollarSign, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePickerWithRange } from "@/components/ui/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OrderStats {
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
  totalOrders: number;
}

export default function ManageOrdersPage() {
  const { token } = useAuthStore();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>();
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        status: statusFilter,
        search: searchTerm,
      });
      if (dateFilter?.from) queryParams.append('startDate', dateFilter.from.toISOString());
      if (dateFilter?.to) queryParams.append('endDate', dateFilter.to.toISOString());

      const [listRes, statsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/orders?${queryParams.toString()}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/order-stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (!listRes.ok || !statsRes.ok) throw new Error("Gagal mengambil data pesanan.");
      
      setOrders(await listRes.json());
      setStats(await statsRes.json());
    } catch (error) {
      toast.error("Gagal memuat data", { description: error instanceof Error ? error.message : "" });
    } finally {
      setIsLoading(false);
    }
  }, [token, statusFilter, dateFilter, searchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => { fetchData(); }, 500);
    return () => clearTimeout(handler);
  }, [fetchData]);

  const columns = getAdminOrderColumns();
  const formatRupiah = (amount: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pesanan Hari Ini</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.ordersToday ?? '...'}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{formatRupiah(stats?.revenueToday ?? 0)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pesanan Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.pendingOrders ?? '...'}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats?.totalOrders ?? '...'}</div></CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Daftar Semua Pesanan</CardTitle>
            <div className="flex flex-col md:flex-row items-center gap-4 pt-4">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input placeholder="Cari ID, customer, atau UMKM..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex w-full md:w-auto gap-2 flex-wrap">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[180px]">
                            <SelectValue placeholder="Filter status..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <DatePickerWithRange date={dateFilter} setDate={setDateFilter} />
                </div>
            </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center p-8 text-muted-foreground">Memuat data pesanan...</div>
          ) : (
            <DataTable columns={columns} data={orders} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
