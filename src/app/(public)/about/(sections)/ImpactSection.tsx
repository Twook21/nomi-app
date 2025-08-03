import React from "react";
import { Leaf, Smile, Users } from "lucide-react";
import Head from "next/head";

const impactData = [
  { icon: Leaf, value: "5 ton", label: "Makanan Terselamatkan" },
  { icon: Smile, value: "10.000+", label: "Porsi Terjual" },
  { icon: Users, value: "500+", label: "Mitra Bisnis Bergabung" },
];

export const ImpactSection = () => {
  return (
    <>
      <Head>
        <title>Dampak Nimo - Target Pencapaian Awal</title>
        <meta
          name="description"
          content="Lihat target dampak awal kami: 5 ton makanan terselamatkan, 10.000+ porsi terjual, dan 500+ mitra bisnis bergabung dalam 6 bulan pertama."
        />
        <meta
          name="keywords"
          content="dampak, impact, food waste, limbah makanan, target, goal, sustainability, lingkungan, bisnis F&B"
        />

        <meta property="og:title" content="Target Dampak Nimo" />
        <meta
          property="og:description"
          content="Bergabunglah dengan kami untuk mencapai target awal yang berdampak besar bagi lingkungan dan masyarakat."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nimo" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Target Dampak Nimo" />
        <meta
          name="twitter:description"
          content="Misi kami untuk mengurangi limbah makanan, satu porsi pada satu waktu."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nimo.id/dampak" />
      </Head>

      <section id="impact" className="py-16 md:py-24 bg-[var(--nimo-light)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
              Target Dampak Awal Kami
            </h2>
            <p className="mt-3 text-[var(--nimo-dark)] text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Ini adalah target yang ingin kami capai bersama Anda dalam 6 bulan
              pertama.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            {impactData.map((item, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-[var(--background)] p-6 sm:p-8 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center"
              >
                <div className="flex justify-center items-center h-12 w-12 sm:h-14 sm:w-14 bg-nimo-yellow/10 rounded-full mx-auto mb-4">
                  <item.icon className="h-6 w-6 sm:h-8 sm:w-8 text-nimo-yellow" />
                </div>
                <p className="text-4xl sm:text-5xl font-bold text-[var(--nimo-dark)]">
                  {item.value}
                </p>
                <h4 className="mt-2 text-base sm:text-xl font-semibold text-[var(--nimo-dark)]">
                  {item.label}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ImpactSection;
