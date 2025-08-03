import React from "react";
import Head from "next/head";
import Image from "next/image";
import { Wallet, Compass, Globe } from "lucide-react";

const benefits = [
  {
    icon: <Wallet className="h-8 w-8 text-nimo-yellow" />,
    title: "Hemat Setiap Hari",
    description:
      "Nikmati diskon hingga 70% untuk makanan berkualitas yang akan membuat kantongmu tersenyum.",
  },
  {
    icon: <Compass className="h-8 w-8 text-nimo-yellow" />,
    title: "Jelajahi Rasa Baru",
    description:
      "Temukan 'harta karun' kuliner tersembunyi di kotamu yang mungkin belum pernah kamu coba sebelumnya.",
  },
  {
    icon: <Globe className="h-8 w-8 text-nimo-yellow" />,
    title: "Berdampak Positif",
    description:
      "Setiap pesananmu adalah aksi nyata dalam mengurangi jejak karbon dan membantu planet kita.",
  },
];

const UserBenefits = () => {
  return (
    <>
      <Head>
        <title>Keuntungan untuk Konsumen Nimo</title>
        <meta
          name="description"
          content="Lebih dari sekadar hemat, Nimo menawarkan pengalaman kuliner baru dan kesempatan untuk berkontribusi positif bagi lingkungan. Makanan enak, harga hemat, dan planet yang lebih baik."
        />
        <meta
          name="keywords"
          content="keuntungan konsumen, hemat makanan, diskon kuliner, jelajahi makanan, dampak positif, lingkungan, food waste, nimo"
        />

        <meta property="og:title" content="Nikmati Keuntungan Konsumen Bersama Nimo" />
        <meta
          property="og:description"
          content="Hemat uang, jelajahi kuliner, dan selamatkan bumi dalam satu aplikasi."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nimo" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Manfaat Jadi Konsumen Nimo" />
        <meta
          name="twitter:description"
          content="Temukan cara baru menikmati makanan lezat dengan harga terjangkau sambil peduli lingkungan."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nimo.id/konsumen#manfaat" />
      </Head>
      <section className="bg-[var(--nimo-light)] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="w-full h-96 relative rounded-2xl shadow-lg overflow-hidden">
              <Image
                src="/images/benefits.png"
                alt="Konsumen Nimo yang senang"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
                Lebih dari Sekadar Makanan Murah
              </h2>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start bg-gray-100 dark:bg-[var(--background)] p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex-shrink-0 mr-4 mt-1 flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 bg-nimo-yellow/10 rounded-full">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[var(--nimo-dark)]">
                      {benefit.title}
                    </h3>
                    <p className="text-[var(--nimo-dark)]/80 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserBenefits;