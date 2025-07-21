/*
================================================================================
File: src/app/profile/layout.tsx (NEW FILE)
Description: Layout khusus untuk semua halaman di dalam /profile.
Ini akan menampilkan sidebar navigasi.
================================================================================
*/
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User, ShoppingBag } from "lucide-react";

const sidebarNavItems = [
  {
    title: "Profil Saya",
    href: "/profile",
    icon: User,
  },
  {
    title: "Riwayat Pesanan",
    href: "/profile/orders",
    icon: ShoppingBag,
  },
];

interface ProfileLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/4">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href ? "bg-accent" : "transparent"
                )}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}