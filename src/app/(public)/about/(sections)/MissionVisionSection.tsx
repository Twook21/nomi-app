// src/components/pages/about/MissionVisionSection.tsx
import React from 'react';
import { Target, Rocket, CheckCircle } from 'lucide-react';

const missions = [
  'Memberdayakan penjual makanan (UMKM, kafe, restoran) untuk mengoptimalkan stok.',
  'Memberikan akses makanan lezat dan terjangkau bagi seluruh lapisan masyarakat.',
  'Mengurangi dampak lingkungan dari food waste melalui aksi kolektif berbasis teknologi.',
];

export const MissionVisionSection = () => {
  return (
    <section id="mission-vision" className="py-20 md:py-28 bg-[var(--nimo-gray)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div className="bg-white p-8 rounded-2xl shadow-md">
            <Target className="h-10 w-10 text-nimo-yellow mb-4" />
            <h3 className="text-3xl font-bold mb-4">Visi Kami</h3>
            <p className="text-xl leading-relaxed italic text-gray-700">
              “Menjadi platform utama pengurangan food waste di Indonesia, menciptakan ekosistem pangan yang lebih berkelanjutan untuk semua.”
            </p>
          </div>
          <div className="p-8">
            <Rocket className="h-10 w-10 text-nimo-yellow mb-4" />
            <h3 className="text-3xl font-bold mb-6">Misi Kami</h3>
            <ul className="space-y-5">
              {missions.map((mission, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-7 w-7 text-nimo-yellow mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{mission}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionVisionSection;