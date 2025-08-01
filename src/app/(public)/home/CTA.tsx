import React from "react";
import Head from "next/head"; // Import Head dari next/head

const CTA = () => {
  return (
    <>
      <Head>
        <title>Bergabung dengan Gerakan Anti-Food Waste Nimo</title>
        <meta
          name="description"
          content="Ayo bergabung dengan Nimo untuk mengatasi food waste. Daftar sekarang secara gratis dan mulailah berhemat, membantu bisnis lokal, serta menyelamatkan lingkungan."
        />
        <meta
          name="keywords"
          content="daftar Nimo, anti food waste, gerakan lingkungan, hemat makanan, selamatkan bumi, aplikasi makanan, promo makanan"
        />
        {/* Open Graph Tags */}
        <meta
          property="og:title"
          content="Jangan Biarkan Makanan Terbuang Sia-sia!"
        />
        <meta
          property="og:description"
          content="Daftar di Nimo sekarang untuk menjadi bagian dari solusi. Mulailah berhemat dan berkontribusi positif bagi lingkungan."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nimo.id/daftar" />{" "}
        {/* Sesuaikan dengan URL halaman pendaftaran */}
        <meta property="og:site_name" content="Nimo" />
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Bergabung dengan Nimo Sekarang" />
        <meta
          name="twitter:description"
          content="Jadilah bagian dari solusi food waste. Daftar gratis di Nimo dan nikmati berbagai manfaatnya!"
        />
      </Head>
      <section id="cta-section" className="bg-nimo-yellow">
        <div className="container mx-auto px-6 py-20 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-nimo-light mb-4">
            Jangan Biarkan Makanan Terbuang Sia-sia!
          </h3>
          <p className="text-nimo-light mb-8 max-w-2xl mx-auto text-lg">
            Bergabunglah dengan gerakan anti-food waste hari ini. Mulai hemat,
            bantu sesama, dan selamatkan planet kita.
          </p>
          <a
            href="/auth/register"
            className="bg-nimo-light text-nimo-yellow font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-colors text-lg shadow-md"
          >
            Daftar Sekarang Gratis
          </a>
        </div>
      </section>
    </>
  );
};

export default CTA;
