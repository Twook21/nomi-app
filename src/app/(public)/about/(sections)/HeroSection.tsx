import React from "react";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <section className="relative pt-12 pb-12 md:pt-18 md:pb-18">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--nimo-gray)]/50 via-[var(--background)] to-[var(--background)] -z-10"></div>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
              Tentang <span className="text-nimo-yellow">NIMO -</span>
              <br />
              <span className="bg-nimo-yellow text-transparent bg-clip-text">
                Selamatkan Makanan, Selamatkan Bumi
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl leading-relaxed max-w-xl mx-auto md:mx-0 text-nimo-dark">
              NIMO adalah platform makanan berlebih di Indonesia yang membantu
              UMKM mengubah stok mendekati kadaluarsa menjadi keuntungan.
            </p>
          </div>
          <div className="relative w-full h-72 md:h-[450px] rounded-2xl">
            <Image
              src="/images/about-hero.png"
              alt="Ilustrasi orang membeli makanan diskon"
              fill
              style={{ objectFit: "cover" }}
              className="rounded-2xl shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
