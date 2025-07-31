"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import {
  Sun,
  Moon,
  ShoppingCart,
  LogOut,
  Settings,
  Handshake,
  Repeat,
  Clock,
  ShieldX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// --- Komponen Tombol Ganti Tema ---
const ThemeToggleButton = () => {
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle Theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
};

// --- Definisi Data Navigasi ---
const customerNavLinks = [
  { href: "/products", label: "Produk" },
  { href: "/profile", label: "Dasbor", exact: true },
  { href: "/profile/orders", label: "Pesanan Saya" },
];

const umkmNavLinks = [
  { href: "/umkm/dashboard", label: "Dasbor UMKM", exact: true },
  { href: "/umkm/products", label: "Produk Saya" },
  { href: "/umkm/orders", label: "Pesanan Masuk" },
];

// --- Komponen Utama Navbar ---
export function Navbar() {
  const [isClient, setIsClient] = useState(false);

  // Menggunakan hook useAuth yang unified
  const { user, isAuthenticated, authMethod } = useAuth();

  // Mengambil fungsi dari auth store
  const { logout, activeView, switchView, cartCount, fetchCartCount, token } =
    useAuthStore();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch cart count untuk JWT method atau jika ada token
  useEffect(() => {
    if (token && authMethod === "jwt") {
      fetchCartCount(token);
    }
  }, [token, authMethod, fetchCartCount]);

  const handleLogout = async () => {
    await logout();
    toast.success("Anda berhasil logout.");
    router.push("/");
    router.refresh();
  };

  const handleSwitchView = () => {
    if (activeView === "customer") {
      switchView("umkm");
      toast.info("Beralih ke tampilan Penjual.");
      router.push("/umkm/");
    } else {
      switchView("customer");
      toast.info("Beralih ke tampilan Pembeli.");
      router.push("/profile");
    }
    router.refresh();
  };

  // Fungsi untuk mendapatkan inisial nama
  const getInitials = (
    name?: string,
    username?: string,
    email?: string
  ): string => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    if (username) {
      return username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Fungsi untuk mendapatkan display name
  const getDisplayName = (): string => {
    return user?.name || user?.username || user?.email?.split("@")[0] || "User";
  };

  // Fungsi untuk mendapatkan avatar URL
  const getAvatarUrl = (): string => {
    if (user?.image) return user.image;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${getDisplayName()}`;
  };

  // Fungsi untuk menentukan menu aktif yang lebih akurat
  const isActive = (href: string, exact?: boolean) => {
    if (href === "/") return pathname === href;
    
    if (exact) {
      return pathname === href;
    }
    
    if (pathname.startsWith(href)) {
      const remainingPath = pathname.slice(href.length);
      return remainingPath === '' || remainingPath.startsWith('/');
    }
    
    return false;
  };

  const navLinkClasses = (href: string, exact?: boolean) =>
    `text-[var(--nimo-dark)] font-medium transition-colors relative ${
      isActive(href, exact) ? "text-nimo-yellow" : ""
    } hover:text-nimo-yellow after:content-[''] after:block after:h-0.5 after:bg-nimo-yellow after:transition-all after:duration-300 after:absolute after:left-0 after:-bottom-1 ${
      isActive(href, exact) ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  const navLinks =
    isClient && activeView === "umkm" ? umkmNavLinks : customerNavLinks;

  // PERBAIKAN: Fungsi helper untuk mengecek status UMKM
  const getUmkmStatus = () => {
    // Pastikan kita handle berbagai kemungkinan nilai
    const status = user?.umkmProfileStatus;
    
    // Debug log untuk melihat nilai sebenarnya
    console.log("UMKM Profile Status:", status, "Type:", typeof status);
    
    return status;
  };

  // PERBAIKAN: Fungsi untuk mengecek apakah user bisa jadi mitra
  const canBecomeMitra = () => {
    const status = getUmkmStatus();
    // Cek jika status adalah null, undefined, atau string kosong
    return status === null || status === undefined || status === "";
  };

  // PERBAIKAN: Fungsi untuk mengecek apakah user sudah verified
  const isVerified = () => {
    const status = getUmkmStatus();
    return status === "verified";
  };

  // PERBAIKAN: Fungsi untuk mengecek apakah user dalam status pending
  const isPending = () => {
    const status = getUmkmStatus();
    return status === "pending";
  };

  return (
    <nav className="bg-[var(--nimo-light)] shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-1 flex justify-start">
            <Link href={activeView === "umkm" ? "/umkm/dashboard" : "/"}>
              <h1 className="text-2xl font-bold text-nimo-yellow cursor-pointer">
                NOMI
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            {isClient && isAuthenticated && (
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={navLinkClasses(link.href, link.exact)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-2 md:gap-4">
              {isClient && isAuthenticated && user ? (
                <>
                  {activeView === "customer" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="relative"
                    >
                      <Link href="/cart">
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-nimo-yellow text-xs font-bold text-white">
                            {cartCount}
                          </span>
                        )}
                        <span className="sr-only">Keranjang Belanja</span>
                      </Link>
                    </Button>
                  )}
                  <ThemeToggleButton />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={getAvatarUrl()}
                            alt={getDisplayName()}
                          />
                          <AvatarFallback>
                            {getInitials(
                              user?.name ?? undefined,
                              user?.username ?? undefined,
                              user?.email ?? undefined
                            )}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-2">
                          <p className="text-sm font-medium leading-none">
                            {getDisplayName()}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {user?.role === "customer"
                                ? "Customer"
                                : user?.role === "umkm_owner"
                                ? "UMKM Owner"
                                : "Admin"}
                            </Badge>
                            {authMethod === "nextauth" && (
                              <Badge variant="outline" className="text-xs">
                                Google
                              </Badge>
                            )}
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {/* PERBAIKAN: Gunakan fungsi helper yang lebih robust */}
                      {isVerified() && (
                        <DropdownMenuItem onClick={handleSwitchView}>
                          <Repeat className="mr-2 h-4 w-4" />
                          <span>
                            {activeView === "customer"
                              ? "Beralih ke Penjual"
                              : "Beralih ke Pembeli"}
                          </span>
                        </DropdownMenuItem>
                      )}

                      {isPending() &&
                        (user.role === "customer" ? (
                          <DropdownMenuItem asChild>
                            <Link href="/profile/pending-verification">
                              <Clock className="mr-2 h-4 w-4" />
                              <span>Status Pendaftaran</span>
                            </Link>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem disabled>
                            <ShieldX className="mr-2 h-4 w-4" />
                            <span>Akun Dinonaktifkan</span>
                          </DropdownMenuItem>
                        ))}

                      {/* PERBAIKAN: Kondisi yang lebih fleksible untuk "Jadi Mitra" */}
                      {canBecomeMitra() && (
                        <DropdownMenuItem asChild>
                          <Link href="/profile/become-partner">
                            <Handshake className="mr-2 h-4 w-4" />
                            <span>Jadi Mitra UMKM</span>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem asChild>
                        <Link
                          href={
                            activeView === "umkm"
                              ? "/umkm/settings"
                              : "/profile/settings"
                          }
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Pengaturan</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : isClient ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90"
                  >
                    <Link href="/auth/register">Daftar</Link>
                  </Button>
                  <ThemeToggleButton />
                </>
              ) : (
                <div className="h-10 w-44 bg-gray-200 animate-pulse rounded-md dark:bg-gray-700"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}