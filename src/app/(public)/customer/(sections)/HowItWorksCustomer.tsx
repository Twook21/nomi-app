import React from "react";
import Head from "next/head";
import { MapPin, ShoppingBag, Smile } from "lucide-react";

const steps = [
  {
    icon: <MapPin className="h-10 w-10 text-nimo-yellow" />,
    title: "1. Temukan Deal",
    description:
      "Jelajahi peta dan temukan penawaran makanan lezat di sekitarmu.",
  },
  {
    icon: <ShoppingBag className="h-10 w-10 text-nimo-yellow" />,
    title: "2. Pesan & Bayar",
    description:
      "Amankan porsi makananmu langsung dari aplikasi dengan beberapa ketukan.",
  },
  {
    icon: <Smile className="h-10 w-10 text-nimo-yellow" />,
    title: "3. Ambil & Nikmati",
    description:
      "Datang ke lokasi, tunjukkan QR code, dan nikmati makananmu dengan harga spesial.",
  },
];

const HowItWorksCustomer = () => {
  return (
    <>
      <Head>
        <title>Cara Kerja Nimo untuk Konsumen</title>
        <meta
          name="description"
          content="Menikmati makanan lezat dengan harga hemat di Nimo semudah 1-2-3. Temukan deal, pesan, dan ambil makananmu dengan mudah."
        />
        <meta
          name="keywords"
          content="cara kerja nimo, konsumen, langkah mudah, pesan makanan, diskon makanan, hemat, aplikasi"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Proses Mudah Pesan Makanan di Nimo"
        />
        <meta
          property="og:description"
          content="Temukan, pesan, dan nikmati. Sederhana, cepat, dan menguntungkan bagi dompet dan lingkungan."
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nimo" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cara Kerja Nimo: Semudah 3 Langkah" />
        <meta
          name="twitter:description"
          content="Ikuti 3 langkah sederhana untuk bergabung dengan gerakan penyelamat makanan."
        />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://nimo.id/konsumen#cara-kerja" />
      </Head>
      <section className="bg-[var(--nimo-light)] py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
              Semudah 1-2-3
            </h2>
            <p className="mt-3 text-[var(--nimo-dark)] text-base sm:text-lg leading-relaxed">
              Menikmati makanan enak dengan harga miring tidak pernah semudah
              ini.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-[var(--background)] p-6 sm:p-8 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-center items-center h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-6 bg-white dark:bg-[var(--nimo-light)] rounded-full shadow-md">
                  {step.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[var(--nimo-dark)] mb-2">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-[var(--nimo-dark)]/80 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorksCustomer;