"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/store/auth";
import { cn } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Settings,
  Repeat,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const sidebarNavItems = [
  { title: "Dasbor", href: "/umkm", icon: LayoutDashboard },
  { title: "Produk Saya", href: "/umkm/products", icon: Package },
  { title: "Pesanan Masuk", href: "/umkm/orders", icon: ShoppingCart },
  { title: "Pengaturan Toko", href: "/umkm/settings", icon: Settings },
];

export default function UmkmDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, authMethod } = useAuth();

  const { switchView, logout } = useAuthStore();

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

  const handleSwitchView = () => {
    switchView("customer");
    toast.info("Beralih ke tampilan Pembeli.");
    router.push("/profile");
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Anda berhasil logout.");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-nimo-yellow text-lg font-semibold text-white md:text-base self-center"
          >
            <span className="text-xl font-bold">N</span>
            <span className="sr-only">Nomi</span>
          </Link>
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === item.href && "bg-accent text-primary font-semibold"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-9 w-9">
              <AvatarImage src={getAvatarUrl()} alt={getDisplayName()} />
              <AvatarFallback>
                {getInitials(
                  user?.name ?? undefined,
                  user?.username ?? undefined,
                  user?.email ?? undefined
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">{getDisplayName()}</p>
              <div className="flex items-center gap-1">
                <p className="text-xs text-muted-foreground">
                  Tampilan Penjual
                </p>
                {authMethod === "nextauth" && (
                  <Badge variant="outline" className="text-xs px-1 py-0">
                    Google
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleSwitchView}
            >
              <Repeat className="h-4 w-4" />
              <span>Beralih ke Pembeli</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
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
