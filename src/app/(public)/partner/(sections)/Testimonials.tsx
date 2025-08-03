import React from "react";
import Head from "next/head";
import Image from "next/image";
import { Quote } from "lucide-react";

const Testimonial = () => {
  return (
    <>
      <Head>
        <title>Testimoni Mitra Nomi - Kafe Senja</title>
        <meta
          name="description"
          content="Baca testimoni dari Sarah Widianti, pemilik Kafe Senja, tentang bagaimana Nomi membantu mengurangi food cost dan mendapatkan pelanggan baru yang loyal."
        />
        <meta
          name="keywords"
          content="testimoni nimo, ulasan mitra, kafe senja, food cost, pelanggan loyal, win-win solution"
        />

        <meta property="og:title" content="Testimoni Mitra: Kafe Senja" />
        <meta
          property="og:description"
          content="Kisah sukses Kafe Senja dalam mengelola surplus makanan dengan bantuan Nomi."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nomi" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Testimoni dari Kafe Senja" />
        <meta
          name="twitter:description"
          content="Simak pengalaman nyata dari mitra Nomi dalam mengubah tantangan menjadi peluang."
        />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nimo.id/mitra#testimoni" />
      </Head>
      <section className="bg-[var(--nimo-light)] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center relative p-8 rounded-xl shadow-sm">
            <Quote className="absolute top-0 left-0 text-nimo-yellow/10 h-16 w-16" />
            <p className="text-xl md:text-2xl font-light italic text-[var(--nimo-dark)] leading-relaxed z-10 relative">
              "Nomi mengubah cara kami mengelola surplus. Food cost menurun
              signifikan dan kami mendapatkan pelanggan baru yang loyal. Ini
              adalah win-win solution yang brilian."
            </p>
            <div className="mt-8 flex items-center justify-center">
              <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4 shadow-md">
                <Image
                  src="/images/partner-avatar-1.jpg"
                  alt="Sarah Widianti"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="text-left">
                <h4 className="font-bold text-lg text-[var(--nimo-dark)]">
                  Sarah Widianti
                </h4>
                <p className="text-sm text-[var(--nimo-dark)]/70">
                  Pemilik, Kafe Senja
                </p>
              </div>
            </div>
            <Quote className="absolute bottom-0 right-0 text-nimo-yellow/10 h-16 w-16 transform rotate-180" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonial;