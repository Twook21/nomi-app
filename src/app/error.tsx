"use client"; // Halaman error wajib menggunakan "use client"

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="bg-[var(--nimo-gray)] min-h-screen flex items-center justify-center p-4 text-center">
      <div className="max-w-lg w-full">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-3xl md:text-5xl font-extrabold text-[var(--nimo-dark)]">
          Terjadi Kesalahan
        </h1>
        <p className="mt-4 text-md md:text-lg text-gray-600 dark:text-gray-300">
          Maaf, sepertinya ada masalah yang tidak terduga. Tim kami sudah diberitahu tentang masalah ini.
        </p>

        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={
              () => reset()
            }
            className="bg-nimo-yellow text-white font-bold py-2 px-6 rounded-full hover:opacity-90 transition-opacity shadow-md"
          >
            Coba Lagi
          </button>
          <Link href="/">
            <button className="bg-transparent text-[var(--nimo-dark)] font-bold py-2 px-6 rounded-full hover:bg-[var(--nimo-gray)] transition-colors border border-gray-300 dark:border-gray-600">
                Kembali ke Beranda
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}