// src/components/pages/about/OurStorySection.tsx
import React from 'react';
import { Leaf } from 'lucide-react';

export const OurStorySection = () => {
  return (
    <section id="story" className="py-20 md:py-28 bg-[var(--nimo-gray)] relative">
      <Leaf className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 text-black/5 -z-1" />
      <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Mengapa Kami Memulai <span className="text-nimo-yellow">NIMO</span>?
        </h2>
        <p className="text-lg leading-relaxed mb-10 text-nimo-dark">
          Setiap tahun, 1,3 miliar ton makanan terbuang sia-sia. Di Indonesia, food waste tidak hanya merusak planet, tetapi juga menyebabkan kerugian ekonomi yang besar. NIMO lahir sebagai jembatan antara penjual makanan berlebih dengan pembeli cerdas.
        </p>
        <blockquote className="text-nimo-dark border-l-4 border-nimo-yellow bg-white/50 p-6 rounded-r-lg italic text-xl font-medium text-left max-w-2xl mx-auto shadow-sm">
          “Kami percaya setiap makanan layak mendapatkan kesempatan kedua untuk dinikmati, bukan dibuang.”
        </blockquote>
      </div>
    </section>
  );
};

export default OurStorySection;