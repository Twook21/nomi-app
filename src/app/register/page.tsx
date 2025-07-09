"use client";

import React, { useState } from 'react';
import { User, Mail, Lock } from 'lucide-react';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Kata sandi tidak cocok!");
            return;
        }
        setError('');
        
        console.log("Registering with:", { name, email, password });
        alert(`Mencoba mendaftar dengan Nama: ${name}, Email: ${email}`);
    };

    return (
        <main className="bg-nimo-gray min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
            <div className="max-w-md w-full bg-white dark:bg-[var(--background)] rounded-2xl shadow-2xl dark:shadow-none dark:border dark:border-gray-700 p-8 space-y-6">
                
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-nimo-yellow">NIMO</h1>
                    <h2 className="mt-2 text-xl font-bold tracking-tight text-[var(--nimo-dark)]">
                        Buat Akun Baru
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Bergabunglah dengan kami dan mulai selamatkan makanan!
                    </p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-[var(--nimo-dark)]">
                            Nama Lengkap
                        </label>
                        <div className="relative mt-1">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <User className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 p-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-nimo-yellow focus:border-transparent transition"
                                placeholder="Nama Anda"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-[var(--nimo-dark)]">
                            Alamat Email
                        </label>
                        <div className="relative mt-1">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 p-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-nimo-yellow focus:border-transparent transition"
                                placeholder="anda@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-[var(--nimo-dark)]">
                            Kata Sandi
                        </label>
                        <div className="relative mt-1">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 p-3 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-nimo-yellow focus:border-transparent transition"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="text-sm font-medium text-[var(--nimo-dark)]">
                            Konfirmasi Kata Sandi
                        </label>
                        <div className="relative mt-1">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full pl-10 p-3 bg-transparent border rounded-md focus:ring-2 focus:ring-nimo-yellow focus:border-transparent transition ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder="••••••••"
                            />
                        </div>
                        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-nimo-yellow hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nimo-yellow"
                        >
                            Daftar
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Sudah punya akun?{' '}
                    <a href="/login" className="font-medium text-nimo-yellow hover:underline">
                        Masuk di sini
                    </a>
                </p>
            </div>
        </main>
    );
};

export default RegisterPage;