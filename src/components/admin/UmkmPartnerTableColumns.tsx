"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { AdminUmkmProfile } from "@/types/admin_umkm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

export const getUmkmPartnerColumns = (
  onSuccess: () => void
): ColumnDef<AdminUmkmProfile>[] => [
  {
    accessorKey: "umkmName",
    header: "Nama UMKM",
  },
  {
    accessorKey: "umkmAddress",
    header: "Alamat",
    cell: ({ row }) => (
      <span className="truncate">{row.original.umkmAddress}</span>
    ),
  },
  {
    accessorKey: "totalTurnover",
    header: "Total Omset",
    cell: ({ row }) => formatRupiah(row.original.totalTurnover),
  },
  {
    accessorKey: "averageRating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 text-nimo-yellow fill-nimo-yellow" />
        {row.original.averageRating.toFixed(1)}
      </div>
    ),
  },
  {
    accessorKey: "isVerified",
    header: "Status",
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerified");
      return (
        <Badge variant={isVerified ? "default" : "destructive"}>
          {isVerified ? "Terverifikasi" : "Pending"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const umkm = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Aksi</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/umkm-partners/${umkm.id}`}>Lihat Detail</Link>
            </DropdownMenuItem>
            {/* Aksi Nonaktifkan/Aktifkan akan ditambahkan di sini */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
