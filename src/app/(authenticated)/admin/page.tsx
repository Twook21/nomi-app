import React from 'react';
import { prisma } from '@/lib/prisma'; 
import { Users, Handshake, Package, ShoppingCart } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex items-center space-x-4">
    <div className="bg-yellow-100 dark:bg-yellow-500/20 p-3 rounded-full">
      <Icon className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
    </div>
  </div>
);

export default async function AdminDashboardPage() {
  const [userCount, partnerCount, productCount, pendingPartners] = await Promise.all([
    prisma.user.count(),
    prisma.partner.count({ where: { status: 'APPROVED' } }),
    prisma.product.count({ where: { status: 'AVAILABLE' } }),
    prisma.partner.count({ where: { status: 'PENDING' } })
  ]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Dashboard</h1>
      
      {/* Grid untuk kartu statistik */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pengguna" value={userCount} icon={Users} />
        <StatCard title="Total Mitra Aktif" value={partnerCount} icon={Handshake} />
        <StatCard title="Produk Tersedia" value={productCount} icon={Package} />
        <StatCard title="Mitra Menunggu Persetujuan" value={pendingPartners} icon={Handshake} />
      </div>

      {/* Di sini Anda bisa menambahkan komponen lain seperti grafik atau tabel aktivitas terbaru */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Aktivitas Terbaru</h2>
          <p className="text-gray-600 dark:text-gray-400">Tabel atau grafik aktivitas akan ditampilkan di sini.</p>
        </div>
      </div>
    </div>
  );
}