import React from "react";
import { Users, Heart, ShieldCheck, TrendingUp, Leaf, Globe } from "lucide-react";
import Head from "next/head";

const BenefitsSection = () => {
  return (
    <>
      <Head>
        <title>Keuntungan Bergabung dengan Nomi</title>
        <meta
          name="description"
          content="Lihat keuntungan bergabung dengan Nomi, baik untuk konsumen yang ingin hemat maupun untuk mitra bisnis yang ingin mengurangi limbah makanan dan meningkatkan pendapatan."
        />
        <meta
          name="keywords"
          content="keuntungan nimo, manfaat nimo, diskon makanan, hemat, bisnis F&B, food waste, keberlanjutan, mitra bisnis, pelanggan baru"
        />

        <meta property="og:title" content="Keuntungan Bergabung dengan Nomi" />
        <meta
          property="og:description"
          content="Temukan manfaat besar bagi konsumen dan mitra bisnis dalam ekosistem Nomi yang berkelanjutan."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nomi" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Keuntungan Bergabung dengan Nomi" />
        <meta
          name="twitter:description"
          content="Jadikan setiap pembelianmu langkah nyata untuk menyelamatkan makanan dan mendapatkan keuntungan."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nimo.id/keuntungan" />
      </Head>
      <section id="benefits" className="py-16 md:py-24 bg-[var(--nimo-light)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
              Mengapa Harus Bergabung dengan <span className="text-bold text-nimo-yellow">NOMI</span>?
            </h2>
            <p className="mt-3 text-[var(--nimo-dark)] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Nomi memberikan manfaat bagi semua pihak dalam rantai makanan.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-gray-100 dark:bg-[var(--background)] p-6 sm:p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-center md:justify-start items-center h-12 w-12 sm:h-14 sm:w-14 bg-nimo-yellow/10 rounded-full mx-auto md:mx-0 mb-4">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-nimo-yellow" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center md:text-left text-[var(--nimo-dark)]">
                Untuk Anda, Para Penyelamat Rasa
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Heart className="h-6 w-6 sm:h-7 sm:w-7 text-nimo-yellow mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[var(--nimo-dark)]">
                      Harga Makanan Lebih Hemat
                    </h4>
                    <p className="text-sm sm:text-base text-[var(--nimo-dark)]">
                      Nikmati hidangan favoritmu dengan diskon besar setiap hari.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-nimo-yellow mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[var(--nimo-dark)]">
                      Kualitas Tetap Terjamin
                    </h4>
                    <p className="text-sm sm:text-base text-[var(--nimo-dark)]">
                      Kami bekerja sama dengan mitra terpercaya untuk memastikan
                      makanan tetap layak dan lezat.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Globe className="h-6 w-6 sm:h-7 sm:w-7 text-nimo-yellow mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[var(--nimo-dark)]">
                      Berkontribusi Selamatkan Bumi
                    </h4>
                    <p className="text-sm sm:text-base text-[var(--nimo-dark)]">
                      Setiap pembelian adalah langkah nyata mengurangi jejak
                      karbon.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 dark:bg-[var(--background)] p-6 sm:p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex justify-center md:justify-start items-center h-12 w-12 sm:h-14 sm:w-14 bg-nimo-yellow/10 rounded-full mx-auto md:mx-0 mb-4">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-nimo-yellow" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-center md:text-left text-[var(--nimo-dark)]">
                Untuk Anda, Para Mitra Bisnis
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <TrendingUp className="h-6 w-6 sm:h-7 sm:w-7 text-nimo-yellow mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[var(--nimo-dark)]">
                      Stok Berlebih Jadi Cuan
                    </h4>
                    <p className="text-sm sm:text-base text-[var(--nimo-dark)]">
                      Ubah potensi kerugian menjadi pendapatan tambahan.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Leaf className="h-6 w-6 sm:h-7 sm:w-7 text-nimo-yellow mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[var(--nimo-dark)]">
                      Brand Peduli Lingkungan
                    </h4>
                    <p className="text-sm sm:text-base text-[var(--nimo-dark)]">
                      Tunjukkan komitmen bisnismu pada isu keberlanjutan dan tarik
                      simpati pelanggan.
                    </p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="h-6 w-6 sm:h-7 sm:w-7 text-nimo-yellow mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-base sm:text-lg text-[var(--nimo-dark)]">
                      Jangkauan Konsumen Baru
                    </h4>
                    <p className="text-sm sm:text-base text-[var(--nimo-dark)]">
                      Dapatkan pelanggan baru yang peduli, loyal, dan antusias
                      dengan misi Anda.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BenefitsSection;