import React from "react";
import Image from "next/image";
import { Wallet, Compass, Globe } from "lucide-react";

const benefits = [
  {
    icon: <Wallet className="h-8 w-8 text-nimo-yellow" />,
    title: "Hemat Setiap Hari",
    description:
      "Nikmati diskon hingga 70% untuk makanan berkualitas yang akan membuat kantongmu tersenyum.",
  },
  {
    icon: <Compass className="h-8 w-8 text-nimo-yellow" />,
    title: "Jelajahi Rasa Baru",
    description:
      "Temukan 'harta karun' kuliner tersembunyi di kotamu yang mungkin belum pernah kamu coba sebelumnya.",
  },
  {
    icon: <Globe className="h-8 w-8 text-nimo-yellow" />,
    title: "Berdampak Positif",
    description:
      "Setiap pesananmu adalah aksi nyata dalam mengurangi jejak karbon dan membantu planet kita.",
  },
];

const UserBenefits = () => {
  return (
    <section className="bg-[var(--nimo-gray)] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Kolom Gambar */}
          <div className="w-full h-96 relative">
            <Image
              src="/images/benefits.png" // GANTI: Lifestyle photo orang senang menerima makanan
              alt="Konsumen NIMO yang senang"
              layout="fill"
              objectFit="cover"
              className="rounded-2xl"
            />
          </div>
          {/* Kolom Teks Benefit */}
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--nimo-dark)]">
              Lebih dari Sekadar Makanan Murah
            </h2>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0 mr-4 mt-1">{benefit.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--nimo-dark)]">
                    {benefit.title}
                  </h3>
                  <p className="text-[var(--nimo-dark)]/80 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserBenefits;
