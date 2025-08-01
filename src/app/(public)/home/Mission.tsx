import React from "react";
import Image from "next/image";
import Head from "next/head";
import { Heart, DollarSign, Globe } from "lucide-react";
import Link from "next/link";

const missionCardsData = [
  {
    icon: <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-nimo-yellow" />,
    title: "Hemat Pengeluaran",
    description: "Dapatkan makanan berkualitas dengan diskon besar. Pilihan cerdas untuk kantong Anda."
  },
  {
    icon: <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-nimo-yellow" />,
    title: "Dukung Bisnis Lokal",
    description: "Bantu restoran, kafe atau UMKM favorit Anda mengurangi kerugian dan tetap bertahan."
  },
  {
    icon: <Globe className="h-6 w-6 sm:h-8 sm:w-8 text-nimo-yellow" />,
    title: "Selamatkan Bumi",
    description: "Setiap pembelian berarti Anda turut andil dalam mengurangi jejak karbon."
  }
];

const Mission = () => {
  return (
    <>
      <Head>
        <title>Misi Nimo - Mengubah Makanan Berlebih Menjadi Berkah</title>
        <meta name="description" content="Nimo adalah platform yang mengubah surplus makanan menjadi berkah. Misi kami adalah membantu masyarakat berhemat, mendukung bisnis lokal, dan menyelamatkan bumi dari limbah makanan." />
        <meta name="keywords" content="misi, tujuan, food waste, anti limbah makanan, Nomi, bisnis F&B, UMKM, keberlanjutan" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Misi Nimo: Menghubungkan Makanan Berlebih dengan Keberkahan" />
        <meta property="og:description" content="Pelajari bagaimana Nimo berupaya mengatasi food waste dengan memberikan manfaat nyata bagi konsumen, bisnis, dan lingkungan." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nimo" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Misi Nimo" />
        <meta name="twitter:description" content="Temukan cara Nimo menciptakan solusi yang menguntungkan semua pihak dalam mengatasi masalah food waste." />
        
        {/* Additional SEO */}
        <link rel="canonical" href="https://nimo.id/misi" />
      </Head>

      <section
        id="mission"
        className="py-16 md:py-24 bg-[var(--background)] transition-colors duration-300"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-12 md:mb-20">
            <div className="relative w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-2xl dark:shadow-none dark:border dark:border-gray-700">
              <Image
                src="/images/mission.png"
                alt="Ilustrasi menyelamatkan makanan"
                layout="fill"
                objectFit="cover"
                priority
              />
            </div>

            <div className="space-y-3 sm:space-y-4">
              <span className="text-nimo-yellow font-semibold uppercase tracking-wider text-xl sm:text-2xl">
                #Misi Kami
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--nimo-dark)] leading-snug">
                Mengubah Makanan Berlebih Menjadi Berkah
              </h2>
              <p className="text-[var(--nimo-dark)] leading-relaxed text-base sm:text-lg">
                <span className="text-nimo-yellow font-bold">NOMI </span>lahir
                dari sebuah gagasan sederhana, bagaimana jika kita bisa
                menghubungkan makanan lezat yang berlebih dengan orang-orang yang
                ingin menikmatinya?
              </p>
              <p className="text-[var(--nimo-dark)] leading-relaxed text-base">
                Aplikasi kami adalah jembatan antara UMKM & Mitra lain yang
                bergerak di bidang F&B yang memiliki surplus makanan dengan Anda.
                Kami percaya, setiap makanan layak untuk dinikmati, bukan dibuang.
              </p>

              <div className="pt-4">
                <Link href="/tentang">
                  <button className="inline-block bg-nimo-yellow text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                    Pelajari Lebih Lanjut
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {missionCardsData.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-[var(--background)] p-6 sm:p-8 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center"
              >
                <div className="flex justify-center items-center h-12 w-12 sm:h-14 sm:w-14 bg-nimo-yellow/10 rounded-full mx-auto mb-4">
                  {React.cloneElement(item.icon, {
                    className: "h-6 w-6 sm:h-8 sm:w-8 text-nimo-yellow"
                  })}
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-[var(--nimo-dark)] mb-2">
                  {item.title}
                </h4>
                <p className="text-[var(--nimo-dark)] text-base leading-relaxed">
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

export default Mission;