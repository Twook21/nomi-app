"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Trash2, Clock, TrendingUp } from 'lucide-react';

// --- Data Mock untuk Laporan ---
const financialData = [
    { title: "Pendapatan Platform (Bulan Ini)", value: "Rp 12.500.000", icon: DollarSign },
    { title: "Total Komisi Terkumpul", value: "Rp 3.125.000", icon: TrendingUp },
    { title: "Total Payout ke Mitra", value: "Rp 9.375.000", icon: DollarSign }
];

const impactData = {
    savedFoodKg: 1280,
    co2ReductionTon: 3.2
};

const popularProductsData = [
    { name: 'Nasi Rendang', penjualan: 450 },
    { name: 'Croissant', penjualan: 380 },
    { name: 'Kopi Susu', penjualan: 320 },
    { name: 'Donat Gula', penjualan: 280 },
    { name: 'Ayam Geprek', penjualan: 250 },
];

const peakHoursData = [
    { hour: '11:00', transactions: 30 },
    { hour: '12:00', transactions: 55 },
    { hour: '13:00', transactions: 45 },
    { hour: '17:00', transactions: 70 },
    { hour: '18:00', transactions: 95 },
    { hour: '19:00', transactions: 80 },
];

const ReportsPage = () => {
    return (
        <div className="space-y-8">
            {/* Header Halaman */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Laporan & Analisis</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Pantau performa keuangan, dampak, dan tren platform Anda.</p>
            </div>

            {/* Laporan Keuangan */}
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Laporan Keuangan</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {financialData.map(item => (
                        <div key={item.title} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center space-x-4">
                                <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                                    <item.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.title}</p>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{item.value}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Laporan Dampak & Tren */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-green-400 to-teal-500 text-white p-6 rounded-xl shadow-lg flex flex-col justify-center text-center">
                    <Trash2 className="mx-auto h-12 w-12 opacity-80 mb-4" />
                    <p className="font-semibold">Total Makanan Terselamatkan</p>
                    <p className="text-5xl font-extrabold my-2">{impactData.savedFoodKg.toLocaleString('id-ID')} <span className="text-3xl font-bold">kg</span></p>
                    <p className="text-sm opacity-90">Setara dengan {impactData.co2ReductionTon} ton pengurangan emisi CO².</p>
                </div>
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Produk Terpopuler (Bulan Ini)</h3>
                     <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={popularProductsData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.1)" />
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={80} stroke="#9ca3af" fontSize={12} />
                            <Tooltip cursor={{fill: 'rgba(251, 191, 36, 0.1)'}} contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '0.5rem' }} />
                            <Bar dataKey="penjualan" fill="#FBBF24" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ReportsPage;