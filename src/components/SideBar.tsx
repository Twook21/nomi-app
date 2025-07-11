"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard, Store, Package, Users, BarChart3, LogOut,
    Archive,
    Settings
} from 'lucide-react';

const navLinks = {
    admin: [
        // { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        // { name: 'Verifikasi Mitra', href: '/verifikasi', icon: Store },
        // { name: 'Manajemen Produk', href: '/produk', icon: Package },
        { name: 'Pengguna', href: '/pengguna', icon: Users },
        // { name: 'Kategori Produk', href: '/kategori', icon: Archive},
        // { name: 'Laporan', href: '/laporan', icon: BarChart3 },
        // { name: 'Pengaturan', href: '/pengaturan', icon: Settings },
    ],
    mitra: [
        // ... link untuk mitra
    ],
    user: [
        // ... link untuk user
    ]
};

export type Role = 'admin' | 'mitra' | 'user';

interface SidebarNavProps {
    role: Role;
    onLinkClick?: () => void;
}

// --- Komponen Navigasi dengan Gaya Baru ---
export const SidebarNav = ({ role, onLinkClick }: SidebarNavProps) => {
    const pathname = usePathname();
    const links = navLinks[role] || [];

    return (
        <nav className="flex-1 px-4 py-4 space-y-2">
            {links.map((link) => {
                const isActive = pathname.startsWith(link.href);
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={onLinkClick}
                        className={`relative flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                            ${isActive
                                ? 'bg-gray-700 text-white font-semibold'
                                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            }`}
                    >
                        {isActive && (
                            <span className="absolute left-0 top-0 h-full w-1 bg-nimo-yellow rounded-r-full"></span>
                        )}
                        <link.icon className="h-5 w-5" />
                        <span>{link.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export const Sidebar = ({ role }: { role: Role }) => {
    const roleTitle = role.charAt(0).toUpperCase() + role.slice(1);

    return (
        <aside className="h-full w-64 flex-col bg-gray-900 text-gray-200 hidden md:flex border-r border-gray-800">
            {/* Header Sidebar */}
            <div className="h-20 flex items-center justify-center">
                <h1 className="text-2xl font-bold text-nimo-yellow">NIMO</h1>
                <span className="ml-2 px-2 py-1 text-xs font-semibold text-nimo-yellow bg-nimo-yellow/10 rounded-full">{roleTitle}</span>
            </div>
            
            <SidebarNav role={role} />

            <div className="mt-auto p-4 border-t border-gray-800">
                {/* <Link href="/profil">
                    <div className="flex items-center space-x-3 mb-4 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                        <img className="h-10 w-10 rounded-full object-cover" src="https://placehold.co/100x100/FBBF24/1E1E1E?text=A" alt="Admin" />
                        <div>
                            <p className="font-semibold text-white text-sm">Admin User</p>
                            <p className="text-xs text-gray-400">admin@nimo.app</p>
                        </div>
                    </div>
                </Link> */}
                <button className="flex w-full items-center justify-center space-x-2 py-2 rounded-lg bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-colors">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};