import React from "react";
import { TrendingUp, UserPlus, Leaf } from "lucide-react";

const benefits = [
  {
    icon: <TrendingUp className="h-10 w-10 text-nimo-yellow" />,
    title: "Maksimalkan Pendapatan",
    description:
      "Konversi stok yang hampir kedaluwarsa menjadi pendapatan, bukan biaya.",
  },
  {
    icon: <UserPlus className="h-10 w-10 text-nimo-yellow" />,
    title: "Jangkauan Pelanggan Baru",
    description:
      "Perkenalkan brand Anda kepada komunitas pembeli yang peduli nilai dan kualitas.",
  },
  {
    icon: <Leaf className="h-10 w-10 text-nimo-yellow" />,
    title: "Citra Bisnis Positif",
    description:
      "Tunjukkan komitmen Anda pada keberlanjutan dan tarik simpati pelanggan modern.",
  },
];

const KeyBenefits = () => {
  return (
    <section className="bg-[var(--nimo-gray)] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--nimo-dark)]">
            Keuntungan Menjadi Mitra NOMI
          </h2>
          <p className="mt-4 text-lg text-[var(--nimo-dark)]/80">
            Platform kami dirancang untuk satu tujuan: membantu bisnis Anda
            tumbuh secara efisien dan berkelanjutan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {benefits.map((item, index) => (
            <div key={index} className="text-center md:text-left">
              <div className="flex justify-center md:justify-start mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-[var(--nimo-dark)] mb-2">
                {item.title}
              </h3>
              <p className="text-[var(--nimo-dark)]/80 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KeyBenefits;
