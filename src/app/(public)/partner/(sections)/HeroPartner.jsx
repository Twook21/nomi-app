"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const HeroPartner = () => {
  return (
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
              dengan NIMO untuk menjangkau ribuan pelanggan baru dan
              meningkatkan pendapatan Anda.
            </p>
            <Link href="/register-partner">
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
              alt="Aplikasi NIMO untuk Mitra"
              layout="fill"
              objectFit="cover"
              priority
              className="rounded-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroPartner;
