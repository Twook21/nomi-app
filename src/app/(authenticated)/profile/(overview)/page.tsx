"use client";

import { useEffect, useState } from "react";
import { useAuthStore, User as UserProfile } from "@/store/auth";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, Home, Edit } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { token, user, setUser, logout } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Jika tidak ada token, tendang ke halaman login
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    // Fungsi untuk mengambil data profil dari API
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          // Jika token tidak valid (misal: expired), logout dan redirect
          if (response.status === 401 || response.status === 403) {
            toast.error("Sesi Anda telah berakhir.", {
              description: "Silakan login kembali.",
            });
            logout();
            router.replace("/auth/login");
          }
          throw new Error("Gagal mengambil data profil.");
        }

        const data: UserProfile = await response.json(); // <-- 2. Gunakan tipe yang diimpor
        setUser(data); // Simpan data user ke store (sekarang tipenya cocok)
      } catch (error) {
        toast.error("Terjadi Kesalahan", {
          description:
            error instanceof Error
              ? error.message
              : "Tidak dapat terhubung ke server.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Jika data user belum ada di store, fetch dari API
    if (!user) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [token, user, router, setUser, logout]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Memuat profil...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        Gagal memuat profil. Coba refresh halaman.
      </div>
    );
  }

  // Helper to safely get a string or fallback
  const safe = (value: string | null | undefined, fallback = "") =>
    value ?? fallback;

  // Mendapatkan inisial untuk Avatar
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto max-w-2xl py-10">
      <Card>
        <CardHeader className="text-center">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${safe(
                user.username,
                "U"
              )}`}
              alt={safe(user.username, "User")}
            />
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-3xl">
            {safe(user.username, "User")}
          </CardTitle>
          <CardDescription>
            Peran:{" "}
            <span className="font-semibold capitalize">
              {safe(user.role, "Pengguna")}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            <User className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm">{safe(user.username, "-")}</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm">{safe(user.email, "-")}</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            <Phone className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm">{safe(user.phoneNumber, "-")}</span>
          </div>
          <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
            <Home className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm">{safe(user.address, "-")}</span>
          </div>
          <Button className="w-full mt-6" disabled>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profil (Segera Hadir)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
