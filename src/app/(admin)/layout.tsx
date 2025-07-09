"use client";

import React, { useState } from 'react';
import { Sidebar, SidebarNav, Role } from '@/components/SideBar'; 
import { LogOut, Menu, X } from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentRole: Role = 'admin';

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        <Sidebar role={currentRole} />

        <div className="flex-1 flex flex-col overflow-hidden">
            <header className="h-16 bg-white dark:bg-gray-800 shadow-md flex justify-between items-center px-6 md:hidden">
                <h1 className="text-xl font-bold text-nimo-yellow">NIMO</h1>
                <button onClick={() => setSidebarOpen(true)} className="text-gray-700 dark:text-gray-200">
                    <Menu className="h-6 w-6" />
                </button>
            </header>

            <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                {children}
            </main>
        </div>

        {sidebarOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
                <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)}></div>
                <aside className="relative w-64 h-full bg-gray-900 text-gray-200 flex flex-col border-r border-gray-800">
                    <div className="h-20 flex items-center justify-between px-4">
                        <div>
                            <h1 className="text-2xl font-bold text-nimo-yellow">NIMO</h1>
                            <span className="px-2 py-1 text-xs font-semibold text-nimo-yellow bg-nimo-yellow/10 rounded-full">Admin</span>
                        </div>
                        <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    
                    <SidebarNav role={currentRole} onLinkClick={() => setSidebarOpen(false)} />

                    <div className="mt-auto p-4 border-t border-gray-800">
                        <div className="flex items-center space-x-3 mb-4 p-2">
                            <img className="h-10 w-10 rounded-full object-cover" src="https://placehold.co/100x100/FBBF24/1E1E1E?text=A" alt="Admin" />
                            <div>
                                <p className="font-semibold text-white text-sm">Admin User</p>
                                <p className="text-xs text-gray-400">admin@nimo.app</p>
                            </div>
                        </div>
                        <button className="flex w-full items-center justify-center space-x-2 py-2 rounded-lg bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-gray-400 transition-colors">
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>
            </div>
        )}
    </div>
  );
}