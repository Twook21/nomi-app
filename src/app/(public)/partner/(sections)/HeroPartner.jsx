"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Head from "next/head";

const HeroPartner = () => {
  return (
    <>
      <Head>
        <title>Nimo untuk Mitra Bisnis - Ubah Surplus Jadi Profit</title>
        <meta
          name="description"
          content="Bergabunglah dengan Nimo dan ubah makanan berlebih Anda menjadi keuntungan. Jangkau ribuan pelanggan baru, kurangi limbah, dan tingkatkan pendapatan bisnis F&B Anda."
        />
        <meta
          name="keywords"
          content="mitra nimo, daftar mitra, bisnis F&B, food waste, surplus makanan, profit, pendapatan tambahan, keberlanjutan"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Bergabung Sebagai Mitra Nimo" />
        <meta
          property="og:description"
          content="Solusi cerdas untuk bisnis F&B dalam mengelola surplus makanan dan meningkatkan profit."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nimo" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mitra Nimo: Solusi Profit & Lingkungan" />
        <meta
          name="twitter:description"
          content="Daftar sekarang dan mulailah mengubah surplus makanan menjadi profit dengan Nimo."
        />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nimo.id/mitra" />
      </Head>
      <section className="bg-[var(--background)]">
        <div className="container mx-auto px-4 sm:px-6 py-20 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Kolom Teks */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="text-left"
            >
              <span className="font-semibold text-nimo-yellow uppercase tracking-widest">
                Untuk Mitra Bisnis
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--nimo-dark)] leading-tight my-4">
                Ubah Surplus Jadi Profit.
              </h1>
              <p className="text-lg text-[var(--nimo-dark)]/80 leading-relaxed max-w-xl mb-8">
                Jangan biarkan makanan berlebih menjadi kerugian. Bergabunglah
                dengan Nimo untuk menjangkau ribuan pelanggan baru dan
                meningkatkan pendapatan Anda.
              </p>
              <Link href="/auth/register">
                <button className="group inline-flex items-center bg-nimo-yellow text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-500 transition-colors duration-300">
                  Mulai Sekarang
                  <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            </motion.div>

            {/* Kolom Gambar */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="relative w-full h-80 md:h-96 rounded-2xl shadow-lg overflow-hidden"
            >
              <Image
                src="/images/partner.png"
                alt="Aplikasi Nimo untuk Mitra"
                layout="fill"
                objectFit="cover"
                priority
                className="rounded-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroPartner;