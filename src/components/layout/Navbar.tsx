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
  Menu,
  X,
  Store,
  UserCircle,
  HandPlatter,
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";


const ThemeToggleButton = ({ className }: { className?: string }) => {
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
      
      className={className}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
};


const customerNavLinks = [
  { href: "/products", label: "Produk", icon: HandPlatter },
  { href: "/profile", label: "Dasbor", exact: true, icon: UserCircle },
  { href: "/profile/orders", label: "Pesanan Saya", icon: Handshake },
];

const umkmNavLinks = [
  { href: "/umkm/dashboard", label: "Dasbor UMKM", exact: true, icon: Store },
  { href: "/umkm/products", label: "Produk Saya", icon: ShoppingCart },
  { href: "/umkm/orders", label: "Pesanan Masuk", icon: Handshake },
];


export function Navbar() {
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, authMethod } = useAuth();

  const { logout, activeView, switchView, cartCount, fetchCartCount, token } =
    useAuthStore();

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

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
    setIsMobileMenuOpen(false); 
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
    setIsMobileMenuOpen(false); 
  };

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

  const getDisplayName = (): string => {
    return user?.name || user?.username || user?.email?.split("@")[0] || "User";
  };

  const getAvatarUrl = (): string => {
    if (user?.image) return user.image;
    return `https://api.dicebear.com/7.x/initials/svg?seed=${getDisplayName()}`;
  };

  const isActive = (href: string, exact?: boolean) => {
    if (href === "/") return pathname === href;

    if (exact) {
      return pathname === href;
    }

    if (pathname.startsWith(href)) {
      const remainingPath = pathname.slice(href.length);
      return remainingPath === "" || remainingPath.startsWith("/");
    }

    return false;
  };

  const navLinkClasses = (href: string, exact?: boolean) =>
    `text-[var(--nimo-dark)] font-medium transition-colors relative ${
      isActive(href, exact) ? "text-nimo-yellow" : ""
    } hover:text-nimo-yellow after:content-[''] after:block after:h-0.5 after:bg-nimo-yellow after:transition-all after:duration-300 after:absolute after:left-0 after:-bottom-1 ${
      isActive(href, exact) ? "after:w-full" : "after:w-0 hover:after:w-full"
    }`;

  const mobileLinkClasses = (href: string, exact?: boolean) =>
    `flex items-center gap-4 py-3 px-4 rounded-md transition-colors ${
      isActive(href, exact)
        ? "bg-gray-100 text-nimo-yellow dark:bg-gray-800"
        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
    }`;

  const navLinks =
    isClient && activeView === "umkm" ? umkmNavLinks : customerNavLinks;

  const getUmkmStatus = () => {
    const status = user?.umkmProfileStatus;
    return status;
  };

  const canBecomeMitra = () => {
    const status = getUmkmStatus();
    return status === null || status === undefined || status === "";
  };

  const isVerified = () => {
    const status = getUmkmStatus();
    return status === "verified";
  };

  const isPending = () => {
    const status = getUmkmStatus();
    return status === "pending";
  };

  const MobileDrawer = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Buka Menu Utama</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader className="mb-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-nimo-yellow">NOMI</h1>
            <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
          </div>
        </SheetHeader>

        {isClient && isAuthenticated && user && (
          <div className="flex flex-col items-start gap-4 p-4 border-b pb-4 mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={getAvatarUrl()} alt={getDisplayName()} />
                <AvatarFallback>
                  {getInitials(
                    user?.name ?? undefined,
                    user?.username ?? undefined,
                    user?.email ?? undefined
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-lg font-semibold leading-none">
                  {getDisplayName()}
                </p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex w-full justify-between items-center">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {user?.role === "customer" ? "Customer" : "UMKM Owner"}
                </Badge>
                {authMethod === "nextauth" && (
                  <Badge variant="outline" className="text-xs">
                    Google
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col flex-grow overflow-y-auto">
          <div className="flex-1 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={mobileLinkClasses(link.href, link.exact)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            ))}
            {activeView === "customer" && (
              <Link
                href="/cart"
                className={`${mobileLinkClasses("/cart")} relative`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Keranjang</span>
                {cartCount > 0 && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-nimo-yellow text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}
            <div className="flex items-center justify-between p-4">
              <span className="font-medium text-gray-700 dark:text-gray-300">
                Ganti Tema
              </span>
              <ThemeToggleButton />
            </div>
          </div>
          {user && (
            <div className="mt-8 border-t pt-4 space-y-1">
              <h3 className="text-sm font-semibold text-gray-500 mb-2 px-4">
                Pengaturan Akun
              </h3>
              {isVerified() && (
                <Button
                  variant="ghost"
                  className="w-full justify-start items-center gap-4 py-3 h-auto"
                  onClick={handleSwitchView}
                >
                  <Repeat className="h-5 w-5" />
                  <span>
                    {activeView === "customer"
                      ? "Beralih ke Penjual"
                      : "Beralih ke Pembeli"}
                  </span>
                </Button>
              )}
              {isPending() && (
                <Link
                  href="/profile/pending-verification"
                  className={mobileLinkClasses(
                    "/profile/pending-verification",
                    true
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Clock className="h-5 w-5" />
                  <span>Status Pendaftaran</span>
                </Link>
              )}
              {canBecomeMitra() && (
                <Link
                  href="/profile/become-partner"
                  className={mobileLinkClasses("/profile/become-partner", true)}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Handshake className="h-5 w-5" />
                  <span>Jadi Mitra UMKM</span>
                </Link>
              )}
              <Link
                href={
                  activeView === "umkm" ? "/umkm/settings" : "/profile/settings"
                }
                className={mobileLinkClasses("/profile/settings", true)}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Settings className="h-5 w-5" />
                <span>Pengaturan</span>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start items-center gap-4 py-3 h-auto"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );

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

                  <div className="hidden md:block">
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
                              {user?.email}
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
                          (user?.role === "customer" ? (
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
                  </div>
                  <div className="md:hidden">
                    <MobileDrawer />
                  </div>
                </>
              ) : isClient ? (
                <>
                  <ThemeToggleButton className="hidden md:block" />
                  <Button
                    variant="ghost"
                    asChild
                    className="hidden md:inline-flex"
                  >
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-nimo-yellow text-white hover:bg-nimo-yellow/90 hidden md:inline-flex"
                  >
                    <Link href="/auth/register">Daftar</Link>
                  </Button>
                  <MobileDrawer />
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
