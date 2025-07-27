"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { AdminOrder } from "@/types/admin_order";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}
function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' });
}
const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    pending: "secondary", processing: "outline", shipped: "default", delivered: "default", cancelled: "destructive",
};

export const getAdminOrderColumns = (): ColumnDef<AdminOrder>[] => [
  {
    accessorKey: "id",
    header: "ID Pesanan",
    cell: ({ row }) => <span className="font-mono text-xs">#{row.original.id.substring(0, 8)}</span>
  },
  {
    accessorKey: "customer.username",
    header: "Nama Pelanggan",
  },
  {
    accessorKey: "umkmOwner.umkmName",
    header: "Nama UMKM",
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
    header: "Tanggal Pesanan",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/orders/${order.id}`}>Lihat Detail</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];