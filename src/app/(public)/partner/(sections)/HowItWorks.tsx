import React from "react";
import Head from "next/head";
import Image from "next/image";

const steps = [
  {
    title: "Unggah Produk Cepat",
    description:
      "Fotokan produk surplus Anda, tentukan harga diskon, dan publikasikan penawaran dalam beberapa klik.",
  },
  {
    title: "Terima Notifikasi Pesanan",
    description:
      "Sistem kami akan memberitahu Anda secara instan saat pelanggan melakukan pemesanan.",
  },
  {
    title: "Siapkan & Verifikasi Pengambilan",
    description:
      "Pelanggan datang ke lokasi Anda. Cukup scan QR code untuk verifikasi pesanan yang mudah dan aman.",
  },
];

const HowItWorks = () => {
  return (
    <>
      <Head>
        <title>Cara Kerja Nimo untuk Mitra</title>
        <meta
          name="description"
          content="Pelajari proses mudah dan cepat Nimo bagi mitra bisnis: unggah produk, terima notifikasi pesanan, dan verifikasi pengambilan dengan QR code."
        />
        <meta
          name="keywords"
          content="cara kerja nimo, proses mitra, aplikasi mitra, verifikasi QR code, surplus makanan, manajemen bisnis"
        />

        {/* Open Graph */}
        <meta property="og:title" content="Proses Nimo yang Mudah untuk Mitra" />
        <meta
          property="og:description"
          content="Ikuti 3 langkah mudah untuk mengubah surplus makanan menjadi pendapatan dengan Nimo."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nimo" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cara Kerja Mitra Nimo" />
        <meta
          name="twitter:description"
          content="Unggah, terima pesanan, dan verifikasi. Semudah itu untuk mulai menghasilkan dari surplus makanan Anda."
        />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nimo.id/mitra#cara-kerja" />
      </Head>
      <section className="bg-[var(--background)] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Kolom Timeline */}
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--nimo-dark)] mb-10">
                Proses Mudah & Cepat
              </h2>
              {/* Garis Vertikal */}
              <div className="absolute left-4 top-[85px] h-[calc(100%-85px)] md:h-[calc(100%-85px)] border-l-2 border-dashed border-nimo-yellow/50"></div>

              <div className="space-y-12">
                {steps.map((step, index) => (
                  <div key={index} className="relative pl-12">
                    <div className="absolute left-0 top-1 flex items-center justify-center h-8 w-8 bg-nimo-yellow rounded-full text-white font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-[var(--nimo-dark)] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[var(--nimo-dark)]/80">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Kolom Gambar */}
            <div className="w-full h-96 bg-[var(--nimo-light)] rounded-2xl p-4">
              <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
                <Image
                  src="/images/dashboard.png"
                  alt="Dashboard Manajemen Mitra Nimo"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;