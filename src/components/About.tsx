import React from 'react';
import { Store, Smile, Leaf } from 'lucide-react';

const aboutData = [
  {
    icon: <Store className="h-12 w-12 text-nimo-yellow" />,
    title: "Untuk Bisnis F&B",
    description: "Ubah makanan berlebih menjadi pendapatan tambahan dan jangkau pelanggan baru. Kurangi limbah dengan mudah."
  },
  {
    icon: <Smile className="h-12 w-12 text-nimo-yellow" />,
    title: "Untuk Masyarakat",
    description: "Nikmati makanan berkualitas dari tempat favoritmu dengan harga yang jauh lebih terjangkau. Makan enak, dompet aman."
  },
  {
    icon: <Leaf className="h-12 w-12 text-nimo-yellow" />,
    title: "Untuk Planet Bumi",
    description: "Setiap makanan yang diselamatkan berarti mengurangi emisi metana dari TPA. Jadilah pahlawan bagi lingkungan."
  }
];

const About = () => {
  return (
    // Menggunakan var() untuk transisi warna background yang mulus
    <section id="about" className="py-12 md:py-20 bg-[var(--nimo-gray)] transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 md:mb-16">
          {/* text-nimo-dark sudah dinamis, tidak perlu diubah */}
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">Solusi Tiga Arah</h3>
          {/* Menambahkan warna teks untuk dark mode */}
          <p className="text-gray-600 dark:text-gray-300 mt-2 sm:mt-3 text-base sm:text-lg">Menang untuk bisnis, menang untuk pembeli, dan menang untuk bumi.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-10">
          {aboutData.map((item, index) => (
            <div
              key={index}
              className="
                bg-white dark:bg-[var(--background)] 
                p-6 sm:p-8 rounded-2xl 
                shadow-lg dark:shadow-none dark:border dark:border-gray-700 
                text-center 
                hover:shadow-xl dark:hover:border-[var(--nimo-yellow)]
                transition-all duration-300 
                transform hover:-translate-y-2"
            >
              <div className="flex justify-center mb-4 sm:mb-5">
                {/* Ikon sudah menggunakan warna aksen, tidak perlu diubah */}
                {item.icon}
              </div>
              <h4 className="text-xl sm:text-2xl text-nimo-yellow font-bold mb-2 sm:mb-3">{item.title}</h4>
              {/* Menambahkan warna teks untuk dark mode */}
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;