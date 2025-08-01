// src/components/pages/about/MissionVisionSection.tsx
import React from "react";
import { Target, Rocket, CheckCircle } from "lucide-react";
import Head from "next/head";

const missions = [
  "Memberdayakan penjual makanan (UMKM, kafe, restoran) untuk mengoptimalkan stok.",
  "Memberikan akses makanan lezat dan terjangkau bagi seluruh lapisan masyarakat.",
  "Mengurangi dampak lingkungan dari food waste melalui aksi kolektif berbasis teknologi.",
];

export const MissionVisionSection = () => {
  return (
    <>
      <Head>
        <title>Visi dan Misi Nimo - Mengurangi Limbah Makanan</title>
        <meta
          name="description"
          content="Pelajari visi dan misi Nimo untuk menjadi platform utama pengurangan food waste di Indonesia, memberdayakan UMKM, dan menyediakan makanan terjangkau."
        />
        <meta
          name="keywords"
          content="visi nimo, misi nimo, food waste, limbah makanan, keberlanjutan, UMKM, makanan terjangkau, lingkungan"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Visi dan Misi Nimo" />
        <meta
          property="og:description"
          content="Platform utama untuk menciptakan ekosistem pangan yang lebih berkelanjutan di Indonesia."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nimo" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Visi dan Misi Nimo" />
        <meta
          name="twitter:description"
          content="Bergabunglah dengan misi kami untuk mengurangi food waste dan memberdayakan komunitas."
        />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nimo.id/tentang-kami#visi-misi" />
      </Head>

      <section
        id="mission-vision"
        className="py-16 md:py-24 bg-[var(--nimo-light)]"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
              Visi dan Misi Kami
            </h2>
            <p className="mt-3 text-[var(--nimo-dark)] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Tujuan kami adalah menciptakan dampak positif yang nyata bagi
              lingkungan dan masyarakat.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Visi */}
            <div className="bg-gray-100 dark:bg-[var(--background)] p-6 sm:p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-center md:justify-start items-center h-12 w-12 sm:h-14 sm:w-14 bg-nimo-yellow/10 rounded-full mx-auto md:mx-0 mb-4">
                <Target className="h-6 w-6 sm:h-8 ml-3 sm:w-8 text-nimo-yellow" />
              </div>
              <h3 className="text-2xl sm:text-3xl text-[var(--nimo-dark)] font-bold mb-4 text-center md:text-left">
                Visi Kami
              </h3>
              <p className="text-base sm:text-lg leading-relaxed italic text-[var(--nimo-dark)] text-center md:text-left">
                “Menjadi platform utama pengurangan food waste di Indonesia,
                menciptakan ekosistem pangan yang lebih berkelanjutan untuk
                semua.”
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white dark:bg-[var(--background)] p-6 sm:p-8 rounded-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-center md:justify-start items-center h-12 w-12 sm:h-14 sm:w-14 bg-nimo-yellow/10 rounded-full mx-auto md:mx-0 mb-4">
                <Rocket className="h-6 w-6 sm:h-8 ml-3 sm:w-8 text-nimo-yellow" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center md:text-left text-[var(--nimo-dark)]">
                Misi Kami
              </h3>
              <ul className="space-y-4">
                {missions.map((mission, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7 text-nimo-yellow mr-4 mt-1 flex-shrink-0" />
                    <span className="text-base sm:text-lg text-[var(--nimo-dark)]">
                      {mission}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MissionVisionSection;
