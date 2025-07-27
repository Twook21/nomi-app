"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Star } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { differenceInDays } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { ToggleProductStatusDialog } from "./ToggleProductStatusDialog";
import { DeleteProductDialog } from "./DeleteProductDialog";

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);
}

const TableActions = ({ product, onSuccess }: { product: Product, onSuccess: () => void }) => {
    const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <>
            <ToggleProductStatusDialog 
                isOpen={isToggleDialogOpen} 
                onOpenChange={setIsToggleDialogOpen} 
                product={product} 
                onSuccess={onSuccess} 
            />
            <DeleteProductDialog 
                isOpen={isDeleteDialogOpen} 
                onOpenChange={setIsDeleteDialogOpen} 
                product={product} 
                onSuccess={onSuccess} 
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setIsToggleDialogOpen(true)}>
                        {product.isAvailable ? "Nonaktifkan" : "Aktifkan"}
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                        Hapus Permanen
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
};

export const getAdminProductColumns = (onSuccess: () => void): ColumnDef<Product>[] => [
  {
    accessorKey: "productName",
    header: "Nama Produk",
    cell: ({ row }) => (
        <div>
            <div className="font-medium">{row.original.productName}</div>
            <div className="text-xs text-muted-foreground">{row.original.umkmOwner.umkmName}</div>
        </div>
    )
  },
  {
    accessorKey: "category.categoryName",
    header: "Kategori",
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
    accessorKey: "totalSold",
    header: "Rasio Penjualan",
    cell: ({ row }) => {
        const totalStock = row.original.stock + row.original.totalSold;
        const ratio = totalStock > 0 ? (row.original.totalSold / totalStock) * 100 : 0;
        return (
            <div className="flex items-center gap-2">
                <Progress value={ratio} className="w-20 h-2" />
                <span className="text-xs text-muted-foreground">{row.original.totalSold}/{totalStock}</span>
            </div>
        )
    }
  },
  {
    accessorKey: "expirationDate",
    header: "Sisa Hari",
    cell: ({ row }) => {
        const daysLeft = differenceInDays(new Date(row.original.expirationDate), new Date());
        if (daysLeft < 0) return <Badge variant="destructive">Kedaluwarsa</Badge>
        if (daysLeft <= 7) return <Badge variant="outline" className="text-amber-600 border-amber-600">{daysLeft} hari</Badge>
        return <span>{daysLeft} hari</span>
    }
  },
  {
    id: "actions",
    cell: ({ row }) => <TableActions product={row.original} onSuccess={onSuccess} />,
  },
];