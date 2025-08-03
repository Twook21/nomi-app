"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import type { AdminUser } from "@/types/admin_user";

interface UpdateRoleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUser;
  onSuccess: () => void;
}

export function UpdateRoleDialog({
  isOpen,
  onOpenChange,
  user,
  onSuccess,
}: UpdateRoleDialogProps) {
  const { token } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState(user.role);

  const handleUpdate = async () => {
    toast.loading("Memperbarui peran...");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...user, role: selectedRole }), 
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Gagal memperbarui peran.");
      }
      
      toast.success(`Peran "${user.username}" berhasil diubah.`);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error("Gagal memperbarui peran.", {
        description: error instanceof Error ? error.message : "Terjadi kesalahan server.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ubah Peran untuk {user.username}</DialogTitle>
          <DialogDescription>
            Pilih peran baru untuk pengguna ini. Perubahan akan langsung diterapkan.
          </DialogDescription>
        </DialogHeader>
        <RadioGroup defaultValue={selectedRole} onValueChange={(value) => setSelectedRole(value as AdminUser['role'])}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="customer" id="r1" />
            <Label htmlFor="r1">Customer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="umkm_owner" id="r2" />
            <Label htmlFor="r2">UMKM Owner</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="admin" id="r3" />
            <Label htmlFor="r3">Admin</Label>
          </div>
        </RadioGroup>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleUpdate}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}