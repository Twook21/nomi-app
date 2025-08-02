import React from "react";

const CtaSection = () => {
  return (
    <section id="cta" className="relative py-24 md:py-32">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/images/cta-background.png')" }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/60"></div>
      <div className="container mx-auto px-4 sm:px-6 text-center relative text-white">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Jadilah Bagian dari Perubahan
        </h2>
        <p className="mt-5 text-lg md:text-xl max-w-2xl mx-auto leading-8">
          Gabung bersama kami untuk menciptakan dunia tanpa food waste, satu
          hidangan dalam satu waktu.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-5">
          <a
            href="/products"
            className="inline-block bg-nimo-yellow text-nimo-light font-bold py-4 px-10 rounded-full text-lg hover:bg-yellow-400 transition-all duration-300 shadow-lg hover:shadow-yellow-500/40 transform hover:scale-105 w-full sm:w-auto"
          >
            Cari Makanan Hemat
          </a>
          <a
            href="auth/register"
            className="inline-block bg-white text-black font-bold py-4 px-10 rounded-full text-lg hover:bg-gray-200 transition-all duration-300 shadow-lg transform hover:scale-105 w-full sm:w-auto"
          >
            Daftarkan Bisnis Anda
          </a>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
