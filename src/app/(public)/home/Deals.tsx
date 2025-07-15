import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Data untuk kategori makanan, bukan penawaran spesifik
const categoriesData = [
  {
    name: "Makanan Kering",
    imageUrl: "/images/makanan_kering.png",
    description:
      "Produk seperti keripik, kue kering, kacang-kacangan, dan makanan ringan lainnya yang dikemas untuk dijual.",
  },
  {
    name: "Roti dan Kue",
    imageUrl: "/images/bakery.png",
    description: "Aneka pastry, roti tawar, dan kue.",
  },
  {
    name: "Makanan Olahan yang Diawetkan",
    imageUrl: "/images/prosses-food.jpg",
    description:
      "Frozen food, makanan kaleng, dan produk olahan lainnya yang memiliki masa simpan lebih lama.",
  },
  {
    name: "Minuman",
    imageUrl: "/images/drinks.png",
    description: "Kopi, jus, teh, dan minuman segar lainnya yang dikemas.",
  },
];

const Deals = () => {
  return (
    <section id="deals" className="py-20 bg-nimo-light">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-nimo-dark">
            Jelajahi Kategori
          </h3>
          <p className="text-[var(--nimo-dark)] mt-3 text-lg">
            Temukan jenis makanan yang ingin kamu selamatkan hari ini.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoriesData.map((category, index) => (
            <div
              key={index}
              className="relative rounded-2xl shadow-lg overflow-hidden group h-80"
            >
              <Image
                src={category.imageUrl}
                alt={`Gambar kategori ${category.name}`}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-110 transition-transform duration-500 ease-in-out"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-6 w-full flex justify-between items-end">
                <div>
                  <h4 className="text-2xl font-bold text-white">
                    {category.name}
                  </h4>
                  <p className="text-gray-200 text-sm">
                    {category.description}
                  </p>
                </div>
                <div className="bg-nimo-yellow text-white p-2 rounded-full transform group-hover:translate-x-1 transition-transform duration-300">
                  <ArrowRight size={20} />
                </div>
              </div>

              {/* Link Overlay */}
              <a
                href="#"
                className="absolute inset-0"
                aria-label={`Jelajahi ${category.name}`}
              ></a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Deals;
