import React from 'react';
import Link from 'next/link';

const EmptyPlateIllustration = () => (
    <svg width="120" height="120" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-70 dark:opacity-50">
        {/* Piring */}
        <circle cx="75" cy="75" r="70" fill="currentColor" className="text-gray-200 dark:text-gray-700/50"/>
        <circle cx="75" cy="75" r="55" stroke="currentColor" strokeWidth="6" className="text-nimo-yellow dark:text-nimo-yellow"/>
        
        {/* Mulut Sedih */}
        <path d="M55 105C60.1667 100.833 75.2 91 95 105" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-nimo-yellow dark:text-nimo-yellow"/>

        {/* Mata 'X' */}
        <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-nimo-yellow dark:text-nimo-yellow">
            {/* Mata Kiri */}
            <path d="M55 70 L70 85" />
            <path d="M70 70 L55 85" />
            {/* Mata Kanan */}
            <path d="M80 70 L95 85" />
            <path d="M95 70 L80 85" />
        </g>
    </svg>
);


export default function NotFound() {
  return (
    <main className="bg-white dark:bg-[var(--background)] min-h-screen flex items-center justify-center p-4 text-center overflow-hidden">
      {/* Elemen dekoratif di latar belakang */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-nimo-yellow/20 dark:bg-nimo-yellow/10 rounded-full filter blur-3xl opacity-50"></div>
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-nimo-yellow/20 dark:bg-nimo-yellow/10 rounded-full filter blur-3xl opacity-50"></div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Ilustrasi */}
        <div className="mb-8 animate-bounce" style={{ animationDuration: '2.5s' }}>
            <EmptyPlateIllustration />
        </div>

        {/* Konten Teks */}
        <p className="text-sm font-bold uppercase tracking-widest text-nimo-yellow">Error 404</p>
        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold text-[var(--nimo-dark)] tracking-tight">
          Halaman Kosong
        </h1>
        <p className="mt-4 max-w-md text-md text-nimo-dark">
          Sama seperti piring ini, halaman yang Anda cari sepertinya tidak ada, atau sedang dalam pengembangan. Mari kita kembali ke tempat yang penuh dengan makanan lezat.
        </p>

        {/* Tombol Aksi */}
        <div className="mt-10">
          <Link href="/">
            <button className="bg-nimo-yellow text-white font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Kembali ke Beranda
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}