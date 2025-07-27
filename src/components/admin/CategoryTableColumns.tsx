"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { AdminFoodCategory } from "@/types/admin_category";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CategoryFormDialog } from "./CategoryFormDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

const TableActions = ({ category, onSuccess }: { category: AdminFoodCategory, onSuccess: () => void }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <>
      <CategoryFormDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        category={category}
        onSuccess={onSuccess}
      />
      <DeleteCategoryDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        category={category}
        onSuccess={onSuccess}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>Edit</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
            Hapus
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const getCategoryColumns = (onSuccess: () => void): ColumnDef<AdminFoodCategory>[] => [
  {
    accessorKey: "categoryName",
    header: "Nama Kategori",
  },
  {
    accessorKey: "_count.products",
    header: "Jumlah Produk",
    cell: ({ row }) => row.original._count.products,
  },
  {
    id: "actions",
    cell: ({ row }) => <TableActions category={row.original} onSuccess={onSuccess} />,
  }
];