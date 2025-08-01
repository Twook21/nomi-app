"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const HeroCustomer = () => {
  return (
    <section className="bg-[var(--background)]">
      <div className="container mx-auto px-4 sm:px-6 py-20 md:py-26">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Kolom Teks */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[var(--nimo-dark)] leading-tight my-4">
              Makan Enak, Harga Hemat.
            </h1>
            <p className="text-lg text-[var(--nimo-dark)]/80 leading-relaxed max-w-xl mb-8">
              Temukan penawaran spesial dari kafe, restoran, dan toko roti
              favoritmu. Selamatkan makanan lezat dari pemborosan sekaligus
              selamatkan dompetmu.
            </p>
            <Link href="/products">
              <button className="group inline-flex items-center bg-nimo-yellow text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-500 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Lihat Deals Terdekat
                <Sparkles className="ml-2 transition-transform duration-300 group-hover:rotate-12" />
              </button>
            </Link>
          </motion.div>

          {/* Kolom Gambar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full h-80 md:h-96"
          >
            <Image
              src="/images/customers.png"
              alt="Makanan lezat dari NOMI"
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroCustomer;
