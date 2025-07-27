"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth"; // Pastikan path ini sesuai
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
import { Button } from "@/components/ui/button"; // Pastikan path ini sesuai
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Pastikan path ini sesuai
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Pastikan path ini sesuai

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
  { href: "/profile", label: "Dasbor" },
  { href: "/profile/orders", label: "Pesanan Saya" },
];

const umkmNavLinks = [
  { href: "/umkm/dashboard", label: "Dasbor UMKM" },
  { href: "/umkm/products", label: "Produk Saya" },
  { href: "/umkm/orders", label: "Pesanan Masuk" },
];

// --- Komponen Utama Navbar ---
export function Navbar() {
  const [isClient, setIsClient] = useState(false);
  // PERUBAHAN 1: Menambahkan cartCount dan fetchCartCount dari store
  const { 
    user, 
    token, 
    logout, 
    activeView, 
    switchView, 
    cartCount, 
    fetchCartCount 
  } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // PERUBAHAN 2: useEffect untuk mengambil data jumlah item di keranjang
  useEffect(() => {
    if (token) {
      fetchCartCount(token);
    }
  }, [token, fetchCartCount]);

  const handleLogout = () => {
    logout();
    toast.success("Anda berhasil logout.");
    router.push("/");
    router.refresh();
  };

  const handleSwitchView = () => {
    if (activeView === "customer") {
      switchView("umkm");
      toast.info("Beralih ke tampilan Penjual.");
      router.push("/umkm/products");
    } else {
      switchView("customer");
      toast.info("Beralih ke tampilan Pembeli.");
      router.push("/profile");
    }
    router.refresh();
  };

  const getInitials = (name: string): string => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinkClasses = (href: string) =>
    `text-[var(--nimo-dark)] font-medium transition-colors relative ${
      isActive(href) ? "text-nimo-yellow" : ""
    } hover:text-nimo-yellow after:content-[''] after:block after:h-0.5 after:bg-nimo-yellow after:transition-all after:duration-300 after:absolute after:left-0 after:-bottom-1 ${
      isActive(href) ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  const navLinks =
    isClient && activeView === "umkm" ? umkmNavLinks : customerNavLinks;

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
            {isClient && token && (
              <div className="flex items-center space-x-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={navLinkClasses(link.href)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-2 md:gap-4">
              {isClient && token && user ? (
                // --- Tampilan Setelah Login ---
                <>
                  {activeView === "customer" && (
                    // PERUBAHAN 3: Mengimplementasikan badge notifikasi pada ikon keranjang
                    <Button variant="ghost" size="icon" asChild className="relative">
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
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`}
                            alt={user?.username || "User"}
                          />
                          <AvatarFallback>
                            {getInitials(user?.username || "")}
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
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {user.username}
                          </p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      {user.umkmProfileStatus === "verified" && (
                        <DropdownMenuItem onClick={handleSwitchView}>
                          <Repeat className="mr-2 h-4 w-4" />
                          <span>
                            {activeView === "customer"
                              ? "Beralih ke Penjual"
                              : "Beralih ke Pembeli"}
                          </span>
                        </DropdownMenuItem>
                      )}

                      {user.umkmProfileStatus === "pending" &&
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

                      {user.umkmProfileStatus === null && (
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
                // --- Tampilan Publik (Sebelum Login) ---
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
                // --- Placeholder saat loading ---
                <div className="h-10 w-44 bg-gray-200 animate-pulse rounded-md dark:bg-gray-700"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}