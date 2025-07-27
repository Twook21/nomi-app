import React from 'react';
import { Leaf, Smile, Users } from 'lucide-react';

const impactData = [
  { icon: Leaf, value: '5 ton', label: 'Makanan Terselamatkan' },
  { icon: Smile, value: '10.000+', label: 'Porsi Terjual' },
  { icon: Users, value: '500+', label: 'Mitra Bisnis Bergabung' },
];

export const ImpactSection = () => {
  return (
    <section id="impact" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Target Dampak Awal Kami</h2>
          <p className="mt-4 text-lg text-nimo-dark max-w-2xl mx-auto">
            Ini adalah target yang ingin kami capai bersama Anda dalam 6 bulan pertama.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {impactData.map((item, index) => (
            <div key={index} className="bg-nimo-yellow p-8 rounded-2xl shadow-lg border border-black hover:border-white hover:border-2 hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <item.icon className="h-14 w-14 mx-auto text-nimo-light mb-4" />
              <p className="text-5xl font-bold text-nimo-light">{item.value}</p>
              <h4 className="mt-2 text-xl font-semibold text-nimo-light">{item.label}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;