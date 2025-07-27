"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import type { AdminUser } from "@/types/admin_user";
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
import { DeleteUserDialog } from "./DeleteUserDialog";
import { UpdateRoleDialog } from "./UpdateRoleDialog";
import Link from "next/link";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const roleVariant: { [key: string]: "default" | "secondary" | "destructive" } =
  {
    customer: "secondary",
    umkm_owner: "default",
    admin: "destructive",
  };

const TableActions = ({
  user,
  onSuccess,
}: {
  user: AdminUser;
  onSuccess: () => void;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateRoleDialogOpen, setIsUpdateRoleDialogOpen] = useState(false);

  return (
    <>
      <DeleteUserDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        userId={user.id}
        username={user.username}
        onSuccess={onSuccess}
      />
      <UpdateRoleDialog
        isOpen={isUpdateRoleDialogOpen}
        onOpenChange={setIsUpdateRoleDialogOpen}
        user={user}
        onSuccess={onSuccess}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Aksi</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/admin/users/${user.id}`}>Lihat Detail</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsUpdateRoleDialogOpen(true)}>
            Ubah Peran
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Hapus Pengguna
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export const getUserColumns = (
  onSuccess: () => void
): ColumnDef<AdminUser>[] => [
  { accessorKey: "username", header: "Username" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "role",
    header: "Peran",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={roleVariant[role] || "default"} className="capitalize">
          {role.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal Bergabung",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <TableActions user={row.original} onSuccess={onSuccess} />
    ),
  },
];
