"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Users,
  Package,
  LayoutDashboard,
  Store,
  ShoppingCart,
  Tags,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const sidebarNavItems = [
  { title: "Dasbor", href: "/admin", icon: LayoutDashboard },
  { title: "Verifikasi UMKM", href: "/admin/verify-umkm", icon: ShieldCheck },
  { title: "Manajemen Mitra", href: "/admin/umkm-partners", icon: Store },
  { title: "Manajemen Pengguna", href: "/admin/users", icon: Users },
  { title: "Manajemen Produk", href: "/admin/products", icon: Package },
  { title: "Manajemen Pesanan", href: "/admin/orders", icon: ShoppingCart },
  { title: "Manajemen Kategori", href: "/admin/categories", icon: Tags },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const getInitials = (name: string) => {
    return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "A";
  };

  const handleLogout = () => {
    logout();
    toast.success("Anda berhasil logout.");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* PERUBAHAN UTAMA ADA DI DALAM <aside> INI */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        {/* Bagian Logo (Tetap di atas) */}
        <div className="flex h-16 items-center justify-center border-b px-4">
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
          >
            <span className="text-xl font-bold">N</span>
            <span className="sr-only">Nomi</span>
          </Link>
        </div>

        {/* Bagian Navigasi (Bisa di-scroll jika tidak cukup) */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col gap-2 p-4">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-accent text-primary font-semibold"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bagian Profil & Logout (Tetap di bawah) */}
        <div className="mt-auto border-t p-4">
          <Link href="/admin/profile" className="mb-3 flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`} alt={user?.username || "A"} />
              <AvatarFallback>{getInitials(user?.username || "")}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{user?.username}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </Link>
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}