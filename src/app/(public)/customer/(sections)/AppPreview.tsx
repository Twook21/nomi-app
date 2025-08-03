import React from "react";
import Image from "next/image";

const AppPreview = () => {
  return (
    <section className="bg-[var(--background)] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-3xl mx-auto mb-12">
          <span className="font-semibold text-nimo-yellow uppercase tracking-widest">
            NOMI App
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--nimo-dark)] mt-2">
            Surga Makanan di Genggamanmu
          </h2>
          <p className="mt-4 text-lg text-[var(--nimo-dark)]/80">
            Dari kopi pagi hingga roti malam, semua penawaran terbaik ada di
            sini.
          </p>
        </div>
        <div className="relative flex justify-center items-center h-150 md:h-[600px]">
          <Image
            src="/images/mockup.png"
            alt="Tampilan aplikasi NOMI"
            width={300}
            height={600}
            className="rounded-3xl shadow-2xl z-10 transform transition duration-500 hover:scale-105"
          />
          <div className="absolute w-48 h-48 bg-nimo-yellow/50 rounded-full -top-10 -left-10 z-0"></div>
          <div className="absolute w-40 h-40 bg-nimo-yellow/50 rounded-full top-80 left-30 z-0"></div>
          <div className="absolute w-64 h-64 bg-nimo-yellow/50 rounded-full -bottom-16 -right-10 z-0"></div>
          <div className="absolute w-40 h-40 bg-nimo-yellow/50 rounded-full bottom-16 right-10 z-0"></div>
        </div>
      </div>
    </section>
  );
};

export default AppPreview;
