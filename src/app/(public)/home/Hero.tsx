import React from "react";
import Head from "next/head"; // Import Head dari next/head

// Data skema untuk SEO
const heroSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Selamatkan Makanan, Hemat Pengeluaran dengan Nomi",
  "description": "Nomi adalah platform yang menghubungkan Anda dengan restoran dan toko untuk menyelamatkan makanan lezat yang berlebih dengan harga diskon hingga 70%. Bergabunglah dengan gerakan anti-food waste kami dan bantu selamatkan bumi, satu hidangan sekali waktu.",
  "url": "https://nimo.id", 
  "image": "https://images.squarespace-cdn.com/content/v1/5d09c24ef3d12d000101d11a/1727747313456-CTO7DZ2ZY2XH0UIQY2BZ/COLLINS+Website+Group+Shot_Internal.jpg?format=2500w", // Ganti dengan URL gambar hero yang sebenarnya
  "mainEntity": {
    "@type": "WebSite",
    "name": "Nomi",
    "url": "https://nimo.id",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://nimo.id/products?q={search_term_string}", 
      "query-input": "required name=search_term_string"
    }
  }
};

const Hero = () => {
  return (
    <>
      <Head>
        <title>Selamatkan Makanan, Hemat Uang dengan Nomi | Gerakan Anti-Food Waste</title>
        <meta name="description" content="Nomi adalah aplikasi anti-food waste yang menghubungkan Anda dengan ribuan restoran dan toko untuk mendapatkan makanan lezat dengan diskon besar. Daftar sekarang dan mulai bantu selamatkan lingkungan." />
        <meta name="keywords" content="anti food waste, limbah makanan, hemat pengeluaran, makanan diskon, restoran, Nomi, Nomi, aplikasi makanan" />
        
        <meta property="og:title" content="Selamatkan Makanan, Hemat Pengeluaran dengan Nomi" />
        <meta property="og:description" content="Bergabunglah dengan Nomi dan dapatkan makanan berkualitas dengan harga terjangkau. Setiap pembelian Anda adalah kontribusi nyata untuk lingkungan." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nimo.id" />
        <meta property="og:image" content="https://images.squarespace-cdn.com/content/v1/5d09c24ef3d12d000101d11a/1727747313456-CTO7DZ2ZY2XH0UIQY2BZ/COLLINS+Website+Group+Shot_Internal.jpg?format=2500w" />
        <meta property="og:site_name" content="Nomi" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Selamatkan Makanan dengan Nomi" />
        <meta name="twitter:description" content="Dapatkan makanan lezat dengan diskon hingga 70% dan bantu kurangi food waste. Mulai petualangan hematmu bersama Nomi!" />
        <meta name="twitter:image" content="https://images.squarespace-cdn.com/content/v1/5d09c24ef3d12d000101d11a/1727747313456-CTO7DZ2ZY2XH0UIQY2BZ/COLLINS+Website+Group+Shot_Internal.jpg?format=2500w" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(heroSchema)
          }}
        />
      </Head>

      <section id="hero" className="relative min-h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url(https://images.squarespace-cdn.com/content/v1/5d09c24ef3d12d000101d11a/1727747313456-CTO7DZ2ZY2XH0UIQY2BZ/COLLINS+Website+Group+Shot_Internal.jpg?format=2500w)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-[1] bg-black/40 dark:bg-black/60"></div>

        <div className="container mx-auto px-4 py-16 md:py-40 text-center relative z-10 flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-extrabold text-[var(--nimo-dark)] mb-4 leading-tight">
            <span className="text-white bg-gradient-to-r from-yellow-200/80 via-yellow-200/50 to-transparent dark:from-nimo-yellow/30 dark:via-nimo-yellow/20 dark:to-transparent box-decoration-clone px-2">
              Selamatkan Makanan, Hemat Pengeluaran.
            </span>
          </h2>
          <p className="text-base text-white xs:text-lg font-bold md:text-xl opacity-90 mb-8 md:mb-10 max-w-md md:max-w-3xl mx-auto">
            <span className="text-nimo-yellow">NOMI</span> menghubungkanmu dengan
            restoran dan toko untuk menyelamatkan makanan lezat berlebih dengan
            harga diskon. Bantu bumi, satu hidangan sekali waktu.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-xs sm:max-w-none mx-auto">
            <a
              href="/customer"
              className="bg-nimo-yellow text-white font-bold py-3 px-6 md:py-4 md:px-10 rounded-full hover:opacity-90 transition-opacity text-base md:text-lg shadow-lg w-full sm:w-auto"
            >
              Temukan Deals Terdekat
            </a>
            <a
              href="/partner"
              className="bg-white text-nimo-dark dark:bg-[var(--nimo-gray)] dark:text-[var(--nimo-dark)] font-bold py-3 px-6 md:py-4 md:px-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-700 text-base md:text-lg shadow-lg w-full sm:w-auto"
            >
              Jadi Mitra
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;