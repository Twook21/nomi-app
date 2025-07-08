"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Store, Package, DollarSign, Bell, AlertCircle, ArrowRight } from 'lucide-react';

// --- Data Mock untuk Tampilan ---
const statCards = [
    { title: "Jumlah UMKM", value: "1,250", icon: Store },
    { title: "Produk Aktif", value: "5,830", icon: Package },
    { title: "Total Transaksi", value: "8,921", icon: Users },
    { title: "Pendapatan Platform", value: "Rp 12.5M", icon: DollarSign }
];

const salesData = [
    { name: 'Jan', Penjualan: 4000, 'Makanan Terselamatkan (kg)': 240 },
    { name: 'Feb', Penjualan: 3000, 'Makanan Terselamatkan (kg)': 139 },
    { name: 'Mar', Penjualan: 5000, 'Makanan Terselamatkan (kg)': 380 },
    { name: 'Apr', Penjualan: 4500, 'Makanan Terselamatkan (kg)': 290 },
    { name: 'Mei', Penjualan: 6000, 'Makanan Terselamatkan (kg)': 480 },
    { name: 'Jun', Penjualan: 5500, 'Makanan Terselamatkan (kg)': 430 }
];

const notifications = [
    { text: "Ada 3 permintaan verifikasi UMKM baru.", icon: AlertCircle, type: "warning" },
    { text: "Laporan masalah dari pengguna #7891.", icon: AlertCircle, type: "danger" },
    { text: "Sistem akan melakukan maintenance pada 10 Juli.", icon: Bell, type: "info" }
];

// --- Komponen Utama Halaman Dashboard ---
const DashboardPage = () => {
    return (
        <div className="space-y-8">
            {/* 1. Ringkasan Statistik */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Ringkasan Statistik</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map(card => (
                        <div key={card.title} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 border border-gray-200 dark:border-gray-700">
                            <div className="bg-nimo-yellow/20 p-3 rounded-full">
                                <card.icon className="h-7 w-7 text-nimo-yellow" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Grafik Tren */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Grafik Tren</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                        <YAxis stroke="#9ca3af" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }} />
                        <Legend />
                        <Bar dataKey="Penjualan" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="Makanan Terselamatkan (kg)" fill="#a7f3d0" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* 3. Notifikasi & Akses Cepat */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Notifikasi Penting</h3>
                    <div className="space-y-4">
                        {notifications.map((notif, i) => (
                            <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <notif.icon className={`h-5 w-5 mt-0.5 flex-shrink-0 ${notif.type === 'warning' ? 'text-yellow-500' : notif.type === 'danger' ? 'text-red-500' : 'text-blue-500'}`} />
                                <p className="text-sm text-gray-700 dark:text-gray-300">{notif.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Akses Cepat</h3>
                    <div className="space-y-3">
                        <button className="w-full flex justify-between items-center text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Verifikasi UMKM Tertunda</span>
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                        </button>
                         <button className="w-full flex justify-between items-center text-left p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                            <span className="font-semibold text-gray-700 dark:text-gray-200">Lihat Laporan Masalah</span>
                            <ArrowRight className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;