import React from "react";

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-[400px] overflow-hidden">
      {/* 1. Background Image (tetap di z-0) */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url(https://images.squarespace-cdn.com/content/v1/5d09c24ef3d12d000101d11a/1727747313456-CTO7DZ2ZY2XH0UIQY2BZ/COLLINS+Website+Group+Shot_Internal.jpg?format=2500w)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      {/* 2. Overlay Gelap (untuk kontras) */}
      <div className="absolute inset-0 z-[1] bg-black/40 dark:bg-black/60"></div>

      {/* 3. Konten Teks (dinaikkan ke z-10) */}
      <div className="container mx-auto px-4 py-16 md:py-40 text-center relative z-10 flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-6xl font-extrabold text-[var(--nimo-dark)] mb-4 leading-tight">
          {/* 4. Highlight Judul dengan Tailwind */}
          <span className="text-white bg-gradient-to-r from-yellow-200/80 via-yellow-200/50 to-transparent dark:from-nimo-yellow/30 dark:via-nimo-yellow/20 dark:to-transparent box-decoration-clone px-2">
            Selamatkan Makanan, Hemat Pengeluaran.
          </span>
        </h2>
        {/* 5. Warna Teks Sekunder Disesuaikan */}
        <p className="text-base text-white xs:text-lg font-bold md:text-xl opacity-90 mb-8 md:mb-10 max-w-md md:max-w-3xl mx-auto">
          <span className="text-nimo-yellow">NIMO</span> menghubungkanmu dengan
          restoran dan toko untuk menyelamatkan makanan lezat berlebih dengan
          harga diskon. Bantu bumi, satu hidangan sekali waktu.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full max-w-xs sm:max-w-none mx-auto">
          <a
            href="#deals"
            className="bg-nimo-yellow text-white font-bold py-3 px-6 md:py-4 md:px-10 rounded-full hover:opacity-90 transition-opacity text-base md:text-lg shadow-lg w-full sm:w-auto"
          >
            Temukan Deals Terdekat
          </a>
          {/* 6. Tombol Sekunder Disesuaikan */}
          <a
            href="#how-it-works"
            className="bg-white text-nimo-dark dark:bg-[var(--nimo-gray)] dark:text-[var(--nimo-dark)] font-bold py-3 px-6 md:py-4 md:px-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-300 dark:border-gray-700 text-base md:text-lg shadow-lg w-full sm:w-auto"
          >
            Jadi Mitra
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;