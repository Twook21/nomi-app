"use client";

import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Tag, Layers, Package, BarChart2 } from 'lucide-react';

// --- Data Mock untuk Produk ---
const mockProducts = [
    { id: 1, name: 'Croissant Cokelat', umkm: 'Bakery Enak Poll', category: 'Toko Roti', stock: 15, expiry: '2024-07-10', price: 10000 },
    { id: 2, name: 'Kopi Susu Gula Aren', umkm: 'Warung Kopi Senja', category: 'Minuman', stock: 8, expiry: '2024-07-09', price: 18000 },
    { id: 3, name: 'Nasi Rendang', umkm: 'Resto Padang Jaya', category: 'Makanan Berat', stock: 5, expiry: '2024-07-09', price: 25000 },
    { id: 4, name: 'Donat Gula', umkm: 'Toko Roti Harum', category: 'Toko Roti', stock: 25, expiry: '2024-07-10', price: 5000 },
    { id: 5, name: 'Ayam Geprek Sambal Bawang', umkm: 'Geprek Juara', category: 'Makanan Berat', stock: 0, expiry: '2024-07-08', price: 20000 },
];

const ProductManagementPage = () => {
    const [products, setProducts] = useState(mockProducts);

    const getStockStatus = (stock: number) => {
        if (stock === 0) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        if (stock < 10) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    };

    return (
        <div className="space-y-6">
            {/* Header Halaman */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Produk Global</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Lihat dan kelola semua produk dari seluruh UMKM.</p>
            </div>

            {/* Laporan & Filter Lanjutan */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-2">
                        <Filter size={18} className="text-gray-500" />
                        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Filter Lanjutan</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input type="text" placeholder="Cari produk..." className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-nimo-yellow" />
                        <select className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-nimo-yellow">
                            <option>Semua Kategori</option>
                            <option>Makanan Berat</option>
                            <option>Toko Roti</option>
                            <option>Minuman</option>
                        </select>
                        <input type="date" className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-nimo-yellow" />
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                    <button className="flex items-center space-x-2 text-nimo-yellow font-semibold">
                        <BarChart2 size={20} />
                        <span>Lihat Laporan Produk</span>
                    </button>
                </div>
            </div>

            {/* Tabel Daftar Produk */}
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Produk</th>
                            <th scope="col" className="px-6 py-3">Kategori</th>
                            <th scope="col" className="px-6 py-3">Stok</th>
                            <th scope="col" className="px-6 py-3">Tgl Kadaluarsa</th>
                            <th scope="col" className="px-6 py-3 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                <td className="px-6 py-4">
                                    <div className="font-semibold text-gray-900 dark:text-white">{product.name}</div>
                                    <div className="text-xs text-gray-500">oleh {product.umkm}</div>
                                </td>
                                <td className="px-6 py-4">{product.category}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${getStockStatus(product.stock)}`}>
                                        {product.stock > 0 ? product.stock : 'Habis'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{product.expiry}</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center space-x-2">
                                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Detail Produk"><Eye size={16} /></button>
                                        <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" title="Edit Produk"><Edit size={16} /></button>
                                        <button className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" title="Hapus Produk"><Trash2 size={16} /></button>
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

export default ProductManagementPage;
