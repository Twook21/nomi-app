"use client";

import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, Search, Eye, Trash2 } from 'lucide-react';

// --- Data Mock untuk Mitra UMKM ---
const mockPartners = [
    { id: 1, name: 'Warung Kopi Senja', owner: 'Pak Budi', type: 'Kafe', joined: '2024-07-01', status: 'Terverifikasi' },
    { id: 2, name: 'Bakery Enak Poll', owner: 'Ibu Rina', type: 'Toko Roti', joined: '2024-07-03', status: 'Menunggu Verifikasi' },
    { id: 3, name: 'Resto Padang Jaya', owner: 'Uni Marni', type: 'Restoran', joined: '2024-07-05', status: 'Ditolak' },
    { id: 4, name: 'Toko Roti Harum', owner: 'Pak Eko', type: 'Toko Roti', joined: '2024-07-06', status: 'Menunggu Verifikasi' },
    { id: 5, name: 'Geprek Juara', owner: 'Mas Agung', type: 'Restoran', joined: '2024-07-08', status: 'Terverifikasi' },
];

const PartnerManagementPage = () => {
    const [partners, setPartners] = useState(mockPartners);

    const getStatusComponent = (status: string) => {
        switch (status) {
            case 'Terverifikasi':
                return <span className="flex items-center space-x-1.5 text-xs font-medium text-green-600 dark:text-green-400"><CheckCircle size={14} /><span>{status}</span></span>;
            case 'Menunggu Verifikasi':
                return <span className="flex items-center space-x-1.5 text-xs font-medium text-yellow-600 dark:text-yellow-400"><Clock size={14} /><span>{status}</span></span>;
            case 'Ditolak':
                return <span className="flex items-center space-x-1.5 text-xs font-medium text-red-600 dark:text-red-400"><XCircle size={14} /><span>{status}</span></span>;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen UMKM</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola, verifikasi, dan lihat detail semua mitra UMKM.</p>
            </div>

            {/* Kontrol & Filter */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Cari UMKM berdasarkan nama atau pemilik..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-nimo-yellow focus:border-transparent"
                    />
                </div>
            </div>

            {/* Tabel Daftar Mitra */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Nama UMKM</th>
                            <th scope="col" className="px-6 py-3">Jenis</th>
                            <th scope="col" className="px-6 py-3">Tanggal Bergabung</th>
                            <th scope="col" className="px-6 py-3">Status Verifikasi</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partners.map(partner => (
                            <tr key={partner.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900 dark:text-white">{partner.name}</div>
                                    <div className="text-xs text-gray-500">Pemilik: {partner.owner}</div>
                                </td>
                                <td className="px-6 py-4">{partner.type}</td>
                                <td className="px-6 py-4">{partner.joined}</td>
                                <td className="px-6 py-4">{getStatusComponent(partner.status)}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button className="font-semibold text-nimo-yellow hover:underline flex items-center justify-center">
                                            <Eye size={16} className="mr-1" />
                                            {partner.status === 'Menunggu Verifikasi' ? 'Review Dokumen' : 'Lihat Detail'}
                                        </button>
                                        <button className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" title="Hapus UMKM"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PartnerManagementPage;