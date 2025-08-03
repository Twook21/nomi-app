import React from "react";
import Head from "next/head";

export const HeroSection = () => {
  return (
    <>
      <Head>
        <title>Tentang Nomi - Gerakan Anti-Food Waste Indonesia</title>
        <meta name="description" content="Nomi adalah platform yang memberdayakan UMKM F&B di Indonesia untuk mengurangi limbah makanan berlebih, sekaligus menawarkan makanan berkualitas dengan harga diskon untuk masyarakat." />
        <meta name="keywords" content="tentang Nomi, anti food waste, limbah makanan, UMKM, Indonesia, startup, sustainability, makanan diskon" />
        
        <meta property="og:title" content="Tentang Nomi: Platform Anti-Food Waste Indonesia" />
        <meta property="og:description" content="Nomi membantu UMKM F&B mengubah makanan berlebih menjadi keuntungan dan masyarakat mendapatkan makanan lezat dengan harga terjangkau." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nimo.id/tentang" />
        <meta property="og:image" content="https://nimo.id/images/about-hero.png" />
        <meta property="og:site_name" content="Nomi" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tentang Nomi" />
        <meta name="twitter:description" content="Pelajari misi Nomi dalam mengatasi food waste di Indonesia dan bagaimana kami berkolaborasi dengan UMKM F&B." />
        <meta name="twitter:image" content="https://nimo.id/images/about-hero.png" />
      </Head>
      <section className="relative pt-16 pb-16 md:pt-24 md:pb-24">
        <div className="absolute inset-0 bg-white dark:bg-[var(--background)] -z-10"></div>
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-nimo-dark">
                Tentang <span className="text-nimo-yellow">NOMI</span>
              </h1>
              <p className="mt-4 text-xl md:text-2xl font-semibold leading-relaxed text-nimo-dark">
                Selamatkan Makanan, Selamatkan Bumi
              </p>
              <p className="mt-6 text-base md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0 text-nimo-dark/80">
                Kami adalah platform yang membantu UMKM makanan dan minuman di Indonesia mengubah stok berlebih menjadi keuntungan, sambil memberikan akses bagi masyarakat untuk mendapatkan makanan berkualitas dengan harga yang lebih terjangkau.
              </p>
            </div>
            
            <div
              className="relative w-full h-72 md:h-[450px] rounded-2xl overflow-hidden shadow-2xl"
              style={{
                backgroundImage: "url('/images/about-hero.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;