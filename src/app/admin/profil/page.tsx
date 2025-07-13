"use client";

import React, { useState } from 'react';
import { User, Mail, Shield, Bell, Save, Edit, Clock } from 'lucide-react';

const activityLog = [
    { action: "Memverifikasi UMKM 'Warung Kopi Senja'", time: "2 jam yang lalu" },
    { action: "Menghapus produk 'Donat Basi'", time: "5 jam yang lalu" },
    { action: "Memblokir pengguna 'Charlie Darmawan'", time: "1 hari yang lalu" },
    { action: "Menambah kategori 'Makanan Beku'", time: "2 hari yang lalu" },
];

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profil Saya</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola informasi pribadi dan pengaturan keamanan akun Anda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Informasi Profil</h3>
                            <button onClick={() => setIsEditing(!isEditing)} className="flex items-center space-x-2 text-sm font-semibold text-nimo-yellow hover:underline">
                                <Edit size={16} />
                                <span>{isEditing ? 'Batal' : 'Edit'}</span>
                            </button>
                        </div>
                        <div className="flex items-center space-x-6">
                            <img className="h-24 w-24 rounded-full object-cover ring-4 ring-nimo-yellow/20" src="https://placehold.co/200x200/FBBF24/1E1E1E?text=A" alt="Admin" />
                            <div className="space-y-2 flex-grow">
                                <div>
                                    <label className="text-xs text-gray-500">Nama Lengkap</label>
                                    <input type="text" defaultValue="Admin User" readOnly={!isEditing} className={`w-full text-lg font-semibold bg-transparent ${isEditing ? 'border-b-2 border-nimo-yellow' : ''}`} />
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500">Email</label>
                                    <input type="email" defaultValue="admin@nimo.app" readOnly={!isEditing} className={`w-full text-md text-gray-600 dark:text-gray-300 bg-transparent ${isEditing ? 'border-b-2 border-nimo-yellow' : ''}`} />
                                </div>
                            </div>
                        </div>
                        {isEditing && (
                            <div className="mt-6 text-right">
                                <button className="flex items-center space-x-2 bg-nimo-yellow text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 ml-auto">
                                    <Save size={18} />
                                    <span>Simpan Perubahan</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                        <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Ubah Kata Sandi</h3>
                        <form className="space-y-4">
                             <input type="password" placeholder="Kata Sandi Saat Ini" className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-nimo-yellow border-transparent" />
                             <input type="password" placeholder="Kata Sandi Baru" className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-nimo-yellow border-transparent" />
                             <input type="password" placeholder="Konfirmasi Kata Sandi Baru" className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-nimo-yellow border-transparent" />
                             <button type="submit" className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500">
                                <Shield size={18} />
                                <span>Perbarui Kata Sandi</span>
                            </button>
                        </form>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-fit">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-4">Log Aktivitas Terbaru</h3>
                    <div className="space-y-4">
                        {activityLog.map((log, index) => (
                            <div key={index} className="flex items-start space-x-3">
                                <div className="mt-1 flex-shrink-0 h-3 w-3 rounded-full bg-nimo-yellow/50"></div>
                                <div>
                                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{log.action}</p>
                                    <p className="text-xs text-gray-500">{log.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};