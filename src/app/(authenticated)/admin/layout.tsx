// src/app/(authenticated)/admin/layout.tsx
import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar Navigasi */}
      <Sidebar/>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header Halaman */}
        <Header />

        {/* Konten Utama Halaman */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
