"use client";

import React, { useState } from 'react';
import { Plus, Search, Eye, Edit, UserX, UserCheck } from 'lucide-react';

// --- Data Mock untuk Pengguna (termasuk UMKM) ---
const mockUsers = [
    { id: 1, name: 'Ahmad Subarjo', email: 'ahmad.s@example.com', avatar: 'https://placehold.co/100x100/FBBF24/1E1E1E?text=A', role: 'Konsumen', joined: '2024-06-15', status: 'Aktif' },
    { id: 2, name: 'Warung Kopi Senja', email: 'owner.kopisenja@example.com', avatar: 'https://placehold.co/100x100/34d399/FFFFFF?text=W', role: 'UMKM', joined: '2024-07-01', status: 'Aktif' },
    { id: 3, name: 'Bunga Citra', email: 'bunga.c@example.com', avatar: 'https://placehold.co/100x100/4ade80/FFFFFF?text=B', role: 'Konsumen', joined: '2024-06-18', status: 'Aktif' },
    { id: 4, name: 'Charlie Darmawan', email: 'charlie.d@example.com', avatar: 'https://placehold.co/100x100/f87171/FFFFFF?text=C', role: 'Konsumen', joined: '2024-06-20', status: 'Diblokir' },
    { id: 5, name: 'Bakery Enak Poll', email: 'admin.bakeryenak@example.com', avatar: 'https://placehold.co/100x100/818cf8/FFFFFF?text=B', role: 'UMKM', joined: '2024-07-03', status: 'Aktif' },
];

const UserManagementPage = () => {
    const [users, setUsers] = useState(mockUsers);

    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Pengguna</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola semua akun konsumen dan UMKM yang terdaftar.</p>
                </div>
                <button className="mt-4 sm:mt-0 flex items-center space-x-2 bg-nimo-yellow text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-opacity">
                    <Plus size={20} />
                    <span>Tambah Akun</span>
                </button>
            </div>

            {/* Kontrol & Filter */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Cari pengguna berdasarkan nama atau email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-nimo-yellow focus:border-transparent"
                    />
                </div>
            </div>

            {/* Tabel Daftar Pengguna */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Pengguna</th>
                            <th scope="col" className="px-6 py-3">Peran</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3">Tanggal Bergabung</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <img className="h-10 w-10 rounded-full" src={user.avatar} alt={user.name} />
                                        <div>
                                            <div className="font-semibold">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.role === 'UMKM' 
                                        ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300' 
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        user.status === 'Aktif' 
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                    }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{user.joined}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Detail & Riwayat Aktivitas"><Eye size={16} /></button>
                                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Edit Profil"><Edit size={16} /></button>
                                        {user.status === 'Aktif' ? (
                                            <button className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" title="Blokir Akun"><UserX size={16} /></button>
                                        ) : (
                                            <button className="p-2 rounded-full text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50" title="Aktifkan Akun"><UserCheck size={16} /></button>
                                        )}
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

export default UserManagementPage;