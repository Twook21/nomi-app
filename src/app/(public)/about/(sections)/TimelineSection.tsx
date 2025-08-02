import React from "react";
import Head from "next/head";

const TimelineSection = () => {
  return (
    <>
      <Head>
        <title>Roadmap & Timeline Nomi</title>
        <meta
          name="description"
          content="Lihat roadmap Nomi dari awal ide hingga rencana ekspansi nasional. Pelajari perjalanan kami dalam mengurangi limbah makanan di Indonesia."
        />
        <meta
          name="keywords"
          content="timeline nimo, roadmap nimo, perjalanan nimo, startup food waste, ekspansi, peluncuran aplikasi"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Perjalanan Nomi" />
        <meta
          property="og:description"
          content="Ikuti perjalanan Nomi dari awal hingga menjadi gerakan nasional melawan limbah makanan."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nomi" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Roadmap Nomi" />
        <meta
          name="twitter:description"
          content="Peta jalan kami untuk menciptakan ekosistem pangan yang lebih berkelanjutan."
        />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nimo.id/tentang-kami#timeline" />
      </Head>
      <section id="timeline" className="py-16 md:py-24 bg-[var(--nimo-light)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
              Perjalanan yang Akan Kita Lalui
            </h2>
            <p className="mt-3 text-[var(--nimo-dark)] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Dari ide hingga menjadi gerakan nasional, inilah peta jalan kami.
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            {/* Garis Vertikal */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-nimo-yellow/30 transform -translate-x-1/2"></div>

            {/* Item Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 md:gap-y-16">
              {/* Item 1 */}
              <div className="md:pr-16 relative">
                <div className="md:text-right p-6 bg-gray-100 dark:bg-[var(--background)] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                  <p className="font-bold text-nimo-yellow text-sm">Pertengahan 2025</p>
                  <h4 className="text-xl font-semibold text-[var(--nimo-dark)] mt-1">
                    Ide & Validasi Konsep
                  </h4>
                  <p className="mt-2 text-sm text-[var(--nimo-dark)]">
                    Nomi lahir dari riset mendalam tentang masalah food waste dan
                    kebutuhan pasar di Indonesia.
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-[17px] transform -translate-y-1/2 h-4 w-4 rounded-full bg-nimo-yellow border-4 border-gray-100 dark:border-[var(--nimo-light)]"></div>
              </div>
              <div></div>

              <div></div>
              {/* Item 2 */}
              <div className="md:pl-16 relative">
                <div className="p-6 bg-gray-100 dark:bg-[var(--background)] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                  <p className="font-bold text-nimo-yellow text-sm">Akhir 2025</p>
                  <h4 className="text-xl font-semibold text-[var(--nimo-dark)] mt-1">
                    Peluncuran Platform & Mitra Perdana
                  </h4>
                  <p className="mt-2 text-sm text-[var(--nimo-dark)]">
                    Platform Nomi resmi diluncurkan di Jabodetabek, menggandeng
                    beberapa mitra pertama.
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -left-[17px] transform -translate-y-1/2 h-4 w-4 rounded-full bg-nimo-yellow border-4 border-gray-100 dark:border-[var(--nimo-light)]"></div>
              </div>

              {/* Item 3 */}
              <div className="md:pr-16 relative">
                <div className="md:text-right p-6 bg-gray-100 dark:bg-[var(--background)] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                  <p className="font-bold text-nimo-yellow text-sm">Pertengahan 2026</p>
                  <h4 className="text-xl font-semibold text-[var(--nimo-dark)] mt-1">
                    Peluncuran Aplikasi Mobile
                  </h4>
                  <p className="mt-2 text-sm text-[var(--nimo-dark)]">
                    Aplikasi Nomi hadir di iOS & Android untuk pengalaman yang
                    lebih mudah dan cepat.
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -right-[17px] transform -translate-y-1/2 h-4 w-4 rounded-full bg-nimo-yellow border-4 border-gray-100 dark:border-[var(--nimo-light)]"></div>
              </div>
              <div></div>

              <div></div>
              {/* Item 4 */}
              <div className="md:pl-16 relative">
                <div className="p-6 bg-gray-100 dark:bg-[var(--background)] rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
                  <p className="font-bold text-nimo-yellow text-sm">2026 & Kedepannya</p>
                  <h4 className="text-xl font-semibold text-[var(--nimo-dark)] mt-1">
                    Ekspansi Nasional
                  </h4>
                  <p className="mt-2 text-sm text-[var(--nimo-dark)]">
                    Membawa misi Nomi ke kota-kota besar lain di seluruh
                    Indonesia.
                  </p>
                </div>
                <div className="hidden md:block absolute top-1/2 -left-[17px] transform -translate-y-1/2 h-4 w-4 rounded-full bg-nimo-yellow border-4 border-gray-100 dark:border-[var(--nimo-light)]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TimelineSection;