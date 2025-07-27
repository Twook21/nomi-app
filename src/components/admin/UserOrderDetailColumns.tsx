"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { AdminUserDetail } from "@/types/admin_user_detail";
import { Badge } from "@/components/ui/badge";

type OrderHistory = AdminUserDetail['orders'][0];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}
function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' });
}
const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    pending: "secondary", processing: "outline", shipped: "default", delivered: "default", cancelled: "destructive",
};

export const getUserOrderColumns = (): ColumnDef<OrderHistory>[] => [
  {
    accessorKey: "id",
    header: "ID Pesanan",
    cell: ({ row }) => <span className="font-mono text-xs">#{row.original.id.substring(0, 8)}</span>
  },
  {
    accessorKey: "umkmOwner.umkmName",
    header: "Toko",
  },
  {
    accessorKey: "totalAmount",
    header: "Total",
    cell: ({ row }) => formatRupiah(Number(row.original.totalAmount)),
  },
  {
    accessorKey: "orderStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("orderStatus") as string;
      return <Badge variant={statusVariant[status] || 'default'} className="capitalize">{status}</Badge>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
];