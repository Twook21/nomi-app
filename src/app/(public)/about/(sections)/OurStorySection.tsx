// src/components/pages/about/OurStorySection.tsx
import React from "react";
import Head from "next/head";
import { Leaf } from "lucide-react";

export const OurStorySection = () => {
  return (
    <>
      <Head>
        <title>Kisah Nimo - Mengapa Kami Melawan Food Waste</title>
        <meta name="description" content="Pelajari kisah di balik Nimo, sebuah platform yang lahir untuk mengatasi masalah limbah makanan di Indonesia. Kami percaya setiap makanan layak untuk dinikmati." />
        <meta name="keywords" content="kisah Nimo, food waste Indonesia, limbah makanan, misi Nimo, startup sosial, sustainability, dampak lingkungan" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Kisah Nimo: Misi Kami Melawan Limbah Makanan" />
        <meta property="og:description" content="Temukan motivasi kami dalam membangun Nimo, solusi untuk mengurangi food waste dan menciptakan dampak positif bagi lingkungan dan ekonomi." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nimo.id/tentang#story" />
        <meta property="og:site_name" content="Nimo" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Kisah Kami" />
        <meta name="twitter:description" content="Alasan kami memulai Nimo, dan mengapa kami berjuang untuk setiap hidangan agar tidak terbuang sia-sia." />
      </Head>

      <section
        id="story"
        className="py-20 md:py-28 bg-white dark:bg-[var(--background)] relative"
      >
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-nimo-dark">
            Mengapa Kami Memulai <span className="text-nimo-yellow">NIMO</span>?
          </h2>
          <p className="text-lg leading-relaxed mb-10 text-nimo-dark/80 max-w-2xl mx-auto">
            Setiap tahun, 1,3 miliar ton makanan terbuang sia-sia. Di Indonesia,
            food waste tidak hanya merusak planet, tetapi juga menyebabkan kerugian ekonomi yang besar. Nimo lahir sebagai jembatan antara penjual makanan berlebih dengan pembeli cerdas.
          </p>
          <blockquote className="text-nimo-dark dark:text-gray-200 border-l-4 border-nimo-yellow p-6 rounded-r-lg italic text-lg font-medium text-left max-w-2xl mx-auto bg-transparent">
            “Kami percaya setiap makanan layak mendapatkan kesempatan kedua untuk
            dinikmati, bukan dibuang.”
          </blockquote>
        </div>
      </section>
    </>
  );
};

export default OurStorySection;