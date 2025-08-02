import React from "react";
import Head from "next/head";
import { TrendingUp, UserPlus, Leaf } from "lucide-react";

const benefits = [
  {
    icon: <TrendingUp className="h-10 w-10 text-nimo-yellow" />,
    title: "Maksimalkan Pendapatan",
    description:
      "Konversi stok yang hampir kedaluwarsa menjadi pendapatan, bukan biaya.",
  },
  {
    icon: <UserPlus className="h-10 w-10 text-nimo-yellow" />,
    title: "Jangkauan Pelanggan Baru",
    description:
      "Perkenalkan brand Anda kepada komunitas pembeli yang peduli nilai dan kualitas.",
  },
  {
    icon: <Leaf className="h-10 w-10 text-nimo-yellow" />,
    title: "Citra Bisnis Positif",
    description:
      "Tunjukkan komitmen Anda pada keberlanjutan dan tarik simpati pelanggan modern.",
  },
];

const KeyBenefits = () => {
  return (
    <>
      <Head>
        <title>Manfaat Menjadi Mitra Nomi</title>
        <meta
          name="description"
          content="Dapatkan keuntungan finansial dan citra positif dengan menjadi mitra Nomi. Maksimalkan pendapatan, jangkau pelanggan baru, dan tunjukkan komitmen pada keberlanjutan."
        />
        <meta
          name="keywords"
          content="keuntungan mitra, manfaat mitra, bisnis berkelanjutan, maksimalkan pendapatan, pelanggan baru, citra bisnis positif, food waste, Nomi"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Keuntungan Bergabung Sebagai Mitra Nomi"
        />
        <meta
          property="og:description"
          content="Bergabunglah dengan Nomi dan ubah surplus makanan menjadi profit sambil membangun brand yang peduli lingkungan."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nomi" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Manfaat Mitra Nomi" />
        <meta
          name="twitter:description"
          content="Lihat bagaimana Nomi dapat membantu bisnis Anda mengurangi limbah dan meningkatkan pendapatan secara bersamaan."
        />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nimo.id/mitra#keuntungan" />
      </Head>
      <section className="bg-[var(--nimo-light)] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
              Keuntungan Menjadi Mitra <span className="text-bold text-nimo-yellow">NOMI</span>
            </h2>
            <p className="mt-3 text-[var(--nimo-dark)] text-base sm:text-lg leading-relaxed">
              Platform kami dirancang untuk satu tujuan: membantu bisnis Anda
              tumbuh secara efisien dan berkelanjutan.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {benefits.map((item, index) => (
              <div
                key={index}
                className="text-center bg-gray-100 dark:bg-[var(--background)] p-6 sm:p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 bg-nimo-yellow/10 rounded-full">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--nimo-dark)] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-[var(--nimo-dark)] leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default KeyBenefits;
