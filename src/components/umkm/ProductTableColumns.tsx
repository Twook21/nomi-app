"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { DeleteProductDialog } from "./DeleteProductDialog"; 

const TableActions = ({ product, onSuccess }: { product: Product, onSuccess: () => void }) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <DeleteProductDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        productId={product.id}
        productName={product.productName}
        onSuccess={onSuccess}
      />
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
            <Link href={`/umkm/products/${product.id}`}>Lihat Detail Analitik</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/umkm/products/${product.id}/edit`}>Edit Produk</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => setIsDeleteDialogOpen(true)}>
            Hapus Produk
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const getColumns = (onSuccess: () => void): ColumnDef<Product>[] => [
  {
    accessorKey: "productName",
    header: "Nama Produk",
  },
  {
    accessorKey: "totalSold",
    header: "Terjual",
  },
  {
    accessorKey: "averageRating",
    header: "Rating",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
        {(row.original.averageRating ?? 0).toFixed(1)}
      </div>
    ),
  },
  {
    accessorKey: "stock",
    header: "Stok",
  },
  {
    accessorKey: "isAvailable",
    header: "Status",
    cell: ({ row }) => {
      const isAvailable = row.getValue("isAvailable");
      return <Badge variant={isAvailable ? "default" : "outline"}>{isAvailable ? "Aktif" : "Nonaktif"}</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TableActions product={row.original} onSuccess={onSuccess} />,
  },
];