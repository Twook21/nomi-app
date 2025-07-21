/*
================================================================================
File: src/components/layout/Navbar.tsx (UPDATED & STYLED)
Description: Navbar untuk pengguna yang sudah login, sekarang dengan
style yang selaras dengan tema aplikasi dan tombol dark mode.
================================================================================
*/
"use client";

import Link from 'next/link';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
// PERBAIKAN: Impor ikon baru dan yang dibutuhkan untuk theme toggle
import { ShoppingCart, LayoutGrid, Sun, Moon } from 'lucide-react';

// Komponen untuk Tombol Ganti Tema
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
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                 bg-gray-200 dark:bg-gray-700 
                 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-nimo-yellow focus:ring-offset-2
                 dark:focus:ring-offset-gray-800`}
      aria-label="Toggle Dark Mode"
    >
      <span
        className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 
                   transition duration-200 ease-in-out
                   ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`}
      >
        <span
          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity
                     ${theme === "light" ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100"}`}
          aria-hidden="true"
        >
          <Sun className="h-4 w-4 text-gray-500" />
        </span>
        <span
          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity
                     ${theme === "dark" ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100"}`}
          aria-hidden="true"
        >
          <Moon className="h-4 w-4 text-nimo-yellow" />
        </span>
      </span>
    </button>
  );
};


export function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const { token, logout } = useAuthStore();
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

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav className="bg-[var(--nimo-light)] shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <h1 className="text-2xl font-bold text-nimo-yellow cursor-pointer">
              NOMI
            </h1>
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            {isClient && token ? (
              <>
                {/* MENU BELANJA DENGAN STYLE BARU */}
                <Link href="/products" className={`text-[var(--nimo-dark)] font-medium transition-colors relative ${isActive('/products') ? "text-nimo-yellow" : ""} hover:text-nimo-yellow after:content-[''] after:block after:h-0.5 after:bg-nimo-yellow after:transition-all after:duration-300 after:absolute after:left-0 after:-bottom-1 ${isActive('/products') ? "after:w-full" : "after:w-0 hover:after:w-full"} hidden sm:flex items-center gap-2`}>
                  <LayoutGrid className="h-4 w-4" />
                  <span>Produk</span>
                </Link>
                <Link href="/cart" className="text-[var(--nimo-dark)] hover:text-nimo-yellow transition-colors">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="sr-only">Keranjang Belanja</span>
                </Link>

                <div className="h-6 border-l border-border mx-2"></div>

                {/* MENU PROFIL & LOGOUT DENGAN STYLE BARU */}
                <Link href="/profile" className={`text-[var(--nimo-dark)] font-medium transition-colors relative ${isActive('/profile') ? "text-nimo-yellow" : ""} hover:text-nimo-yellow after:content-[''] after:block after:h-0.5 after:bg-nimo-yellow after:transition-all after:duration-300 after:absolute after:left-0 after:-bottom-1 ${isActive('/profile') ? "after:w-full" : "after:w-0 hover:after:w-full"} hidden sm:inline`}>
                  Profil
                </Link>
                <Button onClick={handleLogout} className="bg-nimo-yellow text-white font-semibold py-2 px-4 rounded-full hover:opacity-90 transition-opacity h-auto">
                  Logout
                </Button>
                <ThemeToggleButton />
              </>
            ) : isClient ? (
              <>
                {/* Tombol Login & Register dari Navbar Publik */}
                <Link href="/auth/login">
                  <button className="bg-transparent text-[var(--nimo-dark)] font-semibold py-2 px-4 rounded-full hover:bg-[var(--nimo-gray)] transition-colors">
                    Login
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className="bg-nimo-yellow text-white font-semibold py-2 px-4 rounded-full hover:opacity-90 transition-opacity">
                    Daftar
                  </button>
                </Link>
                <ThemeToggleButton />
              </>
            ) : (
              // Placeholder untuk loading state
              <div className="h-10 w-44 bg-gray-200 animate-pulse rounded-md"></div>
            )
            }
          </div>
        </div>
      </div>
    </nav>
  );
}
