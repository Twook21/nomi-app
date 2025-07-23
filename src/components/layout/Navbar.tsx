"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Sun, Moon, ShoppingCart, LayoutGrid, LogOut, Settings } from "lucide-react";
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
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle Theme">
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
};

export function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Anda berhasil logout.");
    router.push('/');
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : '';
  }
  
  const isActive = (href: string) => {
    if (href === "/profile") return pathname === href;
    return pathname.startsWith(href);
  };

  const navLinkClasses = (href: string) => 
    `text-[var(--nimo-dark)] font-medium transition-colors relative ${
      isActive(href) ? "text-nimo-yellow" : ""
    } hover:text-nimo-yellow after:content-[''] after:block after:h-0.5 after:bg-nimo-yellow after:transition-all after:duration-300 after:absolute after:left-0 after:-bottom-1 ${
      isActive(href) ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  return (
    <nav className="bg-[var(--nimo-light)] shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-1 flex justify-start">
            <Link href="/">
              <h1 className="text-2xl font-bold text-nimo-yellow cursor-pointer">
                NOMI
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
            {/* PERBAIKAN: Cek 'token' saja untuk menampilkan menu utama */}
            {isClient && token && (
              <div className="flex items-center space-x-8">
                <Link href="/products" className={navLinkClasses('/products')}>
                  Produk
                </Link>
                <Link href="/profile" className={navLinkClasses('/profile')}>
                  Dasbor
                </Link>
                <Link href="/profile/orders" className={navLinkClasses('/profile/orders')}>
                  Pesanan Saya
                </Link>
              </div>
            )}
          </div>

          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-2 md:gap-4">
              {/* PERBAIKAN: Cek 'token' saja untuk menentukan state login */}
              {isClient && token ? (
                // Tampilan Setelah Login
                <>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/cart">
                      <ShoppingCart className="h-5 w-5" />
                      <span className="sr-only">Keranjang</span>
                    </Link>
                  </Button>
                  
                  <ThemeToggleButton />

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar className="h-10 w-10">
                          {/* Gunakan optional chaining untuk keamanan */}
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`} alt={user?.username || 'User'} />
                          <AvatarFallback>{getInitials(user?.username || '')}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      {user && (
                        <>
                          <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                              <p className="text-sm font-medium leading-none">{user.username}</p>
                              <p className="text-xs leading-none text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </DropdownMenuLabel>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href="/profile/settings"><Settings className="mr-2 h-4 w-4" /><span>Pengaturan Akun</span></Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : isClient ? (
                // Tampilan Publik (Sebelum Login)
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90">
                    <Link href="/auth/register">Daftar</Link>
                  </Button>
                  <ThemeToggleButton />
                </>
              ) : (
                // Placeholder saat loading
                <div className="h-10 w-44 bg-gray-200 animate-pulse rounded-md"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}