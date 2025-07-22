"use client";

import { useState, useEffect } from 'react';
import { useAuthStore, User as UserProfile } from '@/store/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

// Skema validasi untuk form edit profil
const profileSchema = z.object({
  phoneNumber: z.string().min(10, "Nomor telepon minimal 10 digit."),
  address: z.string().min(10, "Alamat minimal 10 karakter."),
  password: z.string().optional().refine(val => val === "" || (val && val.length >= 8), {
    message: "Password baru harus minimal 8 karakter.",
  }),
});

export default function ProfileSettingsPage() {
  const { user, setUser, token } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      password: "",
    },
  });

  // Reset form jika data user berubah (misal setelah fetch awal)
  useEffect(() => {
    if (user) {
      form.reset({
        phoneNumber: user.phoneNumber,
        address: user.address,
        password: "",
      });
    }
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    toast.loading("Menyimpan perubahan...");

    // Hanya kirim data yang diubah
    const payload: { phoneNumber?: string; address?: string; password?: string } = {};
    if (values.phoneNumber !== user?.phoneNumber) payload.phoneNumber = values.phoneNumber;
    if (values.address !== user?.address) payload.address = values.address;
    if (values.password) payload.password = values.password;

    if (Object.keys(payload).length === 0) {
      toast.info("Tidak ada perubahan untuk disimpan.");
      setIsEditing(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Gagal memperbarui profil.");

      // Update data user di state global
      setUser({ ...user!, ...payload });
      toast.success("Profil berhasil diperbarui!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Gagal menyimpan.", {
        description: error instanceof Error ? error.message : "Silakan coba lagi.",
      });
    }
  };

  if (!user) {
    return <div className="flex h-full items-center justify-center">Memuat profil...</div>;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-2 mb-8">
        <h1 className="text-2xl font-bold">Pengaturan Akun</h1>
        <p className="text-muted-foreground">Kelola informasi akun dan preferensi Anda.</p>
      </div>
      <Separator />
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Profil Anda</CardTitle>
          <CardDescription>Informasi ini akan ditampilkan secara publik.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt={user.username} />
                  <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                </Avatar>
                <div className='space-y-1'>
                    <p className='text-xl font-semibold'>{user.username}</p>
                    <p className='text-sm text-muted-foreground'>{user.email}</p>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="0812..." {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input placeholder="Jl. Merdeka..." {...field} disabled={!isEditing} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isEditing && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password Baru (Opsional)</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormDescription>
                        Kosongkan jika Anda tidak ingin mengubah password.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <Button type="button" variant="ghost" onClick={() => {
                      setIsEditing(false);
                      form.reset(); // Kembalikan form ke nilai awal
                    }}>
                      Batal
                    </Button>
                    <Button type="submit" className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90">Simpan Perubahan</Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    Edit Profil
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}