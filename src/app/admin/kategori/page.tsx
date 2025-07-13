"use client";

import React, { useState } from 'react';
import { Tag, Edit, Trash2, Plus, X } from 'lucide-react';

const mockCategories = [
    { id: 1, name: 'Makanan Berat', productCount: 15 },
    { id: 2, name: 'Toko Roti', productCount: 42 },
    { id: 3, name: 'Minuman', productCount: 28 },
    { id: 4, name: 'Camilan', productCount: 35 },
    { id: 5, name: 'Makanan Penutup', productCount: 18 },
];

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState(mockCategories);
    const [editingCategory, setEditingCategory] = useState<{id: number, name: string} | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');

    const formTitle = editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru';
    const buttonText = editingCategory ? 'Simpan Perubahan' : 'Tambah Kategori';

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCategory) {
            console.log(`Editing category ${editingCategory.id} to ${newCategoryName}`);
        } else {
            console.log(`Adding new category: ${newCategoryName}`);
        }
        setNewCategoryName('');
        setEditingCategory(null);
    };
    
    const handleEditClick = (category: {id: number, name: string}) => {
        setEditingCategory(category);
        setNewCategoryName(category.name);
    }

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setNewCategoryName('');
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manajemen Kategori</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola semua kategori produk yang tersedia di platform.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">Daftar Kategori</h3>
                    <div className="space-y-3">
                        {categories.map(category => (
                            <div key={category.id} className="flex justify-between items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                <div className="flex items-center space-x-3">
                                    <Tag className="h-5 w-5 text-gray-400" />
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{category.name}</p>
                                        <p className="text-xs text-gray-500">{category.productCount} produk</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => handleEditClick(category)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600" title="Edit"><Edit size={16} /></button>
                                    <button className="p-2 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50" title="Hapus"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 h-fit">
                     <h3 className="font-bold text-lg mb-4 text-gray-800 dark:text-white">{formTitle}</h3>
                     <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="category-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Nama Kategori</label>
                            <input
                                id="category-name"
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Contoh: Makanan Ringan"
                                required
                                className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-transparent rounded-lg focus:ring-2 focus:ring-nimo-yellow"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                             <button type="submit" className="w-full flex items-center justify-center space-x-2 bg-nimo-yellow text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-opacity">
                                <Plus size={20} />
                                <span>{buttonText}</span>
                            </button>
                            {editingCategory && (
                                <button type="button" onClick={handleCancelEdit} className="p-3 rounded-lg bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500" title="Batal Edit">
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                     </form>
                </div>
            </div>
        </div>
    );
};

export default CategoryManagementPage;