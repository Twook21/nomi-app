// app/profile/settings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useAuthStore, User as UserProfile } from "@/store/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Skema validasi untuk form edit profil
const profileSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Nomor telepon minimal 10 digit.")
    .or(z.literal("")),
  address: z.string().min(10, "Alamat minimal 10 karakter.").or(z.literal("")),
  password: z
    .string()
    .optional()
    .refine((val) => val === "" || (val && val.length >= 8), {
      message: "Password baru harus minimal 8 karakter.",
    }),
});

export default function ProfileSettingsPage() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    authMethod,
  } = useAuth();
  const { setUser: setAuthStoreUser, token } = useAuthStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      phoneNumber: user?.phoneNumber || "",
      address: user?.address || "",
      password: "",
    },
  });

  useEffect(() => {
    const loadInitialData = async () => {
      if (!isAuthenticated) {
        setIsLoadingData(false);
        return;
      }

      if (user) {
        form.reset({
          phoneNumber: user.phoneNumber ?? "",
          address: user.address ?? "",
          password: "",
        });
        setIsLoadingData(false);
      } else {
        setIsLoadingData(true);
      }
    };

    loadInitialData();
  }, [user, isAuthenticated, form]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    toast.loading("Menyimpan perubahan...", { id: "profile-update" }); // Tambahkan ID untuk toast

    const payload: {
      phoneNumber?: string;
      address?: string;
      password?: string;
    } = {};
    if (values.phoneNumber !== (user?.phoneNumber ?? ""))
      payload.phoneNumber = values.phoneNumber;
    if (values.address !== (user?.address ?? ""))
      payload.address = values.address;
    if (values.password) payload.password = values.password;

    if (Object.keys(payload).length === 0) {
      toast.info("Tidak ada perubahan untuk disimpan.", {
        id: "profile-update",
      });
      setIsEditing(false);
      return;
    }

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (authMethod === "jwt" && token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`,
        {
          method: "PUT",
          headers,
          credentials: authMethod === "nextauth" ? "include" : "omit",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Gagal memperbarui profil.");

      if (result.user) {
        setAuthStoreUser({
          ...result.user,
          umkmProfileStatus: user?.umkmProfileStatus,
        });
      }

      toast.success("Profil berhasil diperbarui!", { id: "profile-update" });
      setIsEditing(false);
    } catch (error) {
      toast.error("Gagal menyimpan.", {
        id: "profile-update",
        description:
          error instanceof Error ? error.message : "Silakan coba lagi.",
      });
    }
  };

  if (authLoading || isLoadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg text-gray-700">Memuat profil Anda...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md text-center shadow-lg rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Akses Ditolak
            </CardTitle>
            <CardDescription className="text-gray-600">
              Silakan login untuk mengakses pengaturan profil Anda.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="mt-6 w-full py-2 bg-nimo-yellow text-white hover:bg-nimo-yellow/90 transition-colors duration-200 ease-in-out rounded-md text-lg font-medium"
            >
              <Link href="/auth/login">Login Sekarang</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getInitials = (name?: string | null) => {
    if (!name) return user?.email?.charAt(0)?.toUpperCase() || "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const displayUsername =
    user.username || user.email?.split("@")[0] || "Pengguna";
  const displayName = user.name || displayUsername;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex justify-center items-start">
      <div className="w-full max-w-4xl space-y-8 mt-8">
        {/* Header Section */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            Pengaturan Akun
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Kelola informasi akun dan preferensi Anda dengan mudah.
          </p>
        </div>

        <Separator className="bg-gray-200" />

        {/* Profile Card */}
        <Card className="bg-white shadow-xl rounded-xl border border-gray-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Informasi Profil
            </CardTitle>
            <CardDescription className="text-gray-600">
              Perbarui detail pribadi Anda. Informasi ini bersifat pribadi dan
              aman.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Avatar and User Info */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-nimo-yellow/50 shadow-md">
                    <AvatarImage
                      src={
                        user.image ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${displayUsername}`
                      }
                      alt={displayUsername}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-nimo-yellow text-white text-2xl font-bold">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-2xl font-bold text-gray-900">
                      {displayName}
                    </p>
                    <p className="text-md text-muted-foreground">
                      {user.email}
                    </p>
                    {process.env.NODE_ENV === "development" && (
                      <Badge variant="outline" className="text-xs">
                        {authMethod === "nextauth" ? "Google" : "Email"}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Nomor Telepon
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: 081234567890"
                            {...field}
                            disabled={!isEditing}
                            className="border-gray-300 focus-visible:ring-nimo-yellow/70"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-medium">
                          Alamat
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Contoh: Jl. Merdeka No. 123, Bandung"
                            {...field}
                            disabled={!isEditing}
                            className="border-gray-300 focus-visible:ring-nimo-yellow/70"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />
                  {isEditing && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-gray-700 font-medium">
                            Password Baru (Opsional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="********"
                              {...field}
                              className="border-gray-300 focus-visible:ring-nimo-yellow/70"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-500 text-sm mt-1">
                            Kosongkan jika Anda tidak ingin mengubah password
                            Anda.
                          </FormDescription>
                          <FormMessage className="text-red-500 text-sm" />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-8">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          form.reset({
                            phoneNumber: user.phoneNumber ?? "",
                            address: user.address ?? "",
                            password: "",
                          });
                          toast.info("Perubahan dibatalkan.", {
                            id: "profile-update",
                          });
                        }}
                        className="px-6 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        className="px-6 py-2 rounded-md bg-nimo-yellow text-white hover:bg-nimo-yellow/90 transition-colors duration-200 font-semibold"
                        disabled={form.formState.isSubmitting} // Disable button saat submit
                      >
                        {form.formState.isSubmitting
                          ? "Menyimpan..."
                          : "Simpan Perubahan"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 rounded-md bg-nimo-yellow text-white hover:bg-nimo-yellow/90 transition-colors duration-200 font-semibold"
                    >
                      Edit Profil
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
