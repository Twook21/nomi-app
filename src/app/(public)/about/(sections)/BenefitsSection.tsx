import React from "react";
import {
  Users,
  Heart,
  ShieldCheck,
  TrendingUp,
  Leaf,
  Globe,
} from "lucide-react";

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Mengapa Harus Bergabung dengan NIMO?
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Kartu Konsumen */}
          <div className="group bg-[var(--nimo-gray)] p-8 rounded-2xl border border-black hover:border-nimo-yellow hover:bg-white transition-all duration-300 shadow-md dark:hover:bg-gray-500 hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 text-center text-nimo-dark">
              Untuk Anda, Para Penyelamat Rasa
            </h3>
            <ul className="space-y-6">
              <li className="flex items-center">
                <Heart className="h-10 w-10 text-nimo-yellow mr-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg">
                    Harga Makanan Lebih Hemat
                  </h4>
                  <p className="text-nimo-dark">
                    Nikmati hidangan favoritmu dengan diskon besar setiap hari.
                  </p>
                </div>
              </li>
              <li className="flex items-center">
                <ShieldCheck className="h-10 w-10 text-nimo-yellow mr-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg">Kualitas Tetap Terjamin</h4>
                  <p className="text-nimo-dark">
                    Kami bekerja sama dengan mitra terpercaya untuk memastikan
                    makanan tetap layak dan lezat.
                  </p>
                </div>
              </li>
              <li className="flex items-center">
                <Globe className="h-10 w-10 text-nimo-yellow mr-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg">
                    Berkontribusi Selamatkan Bumi
                  </h4>
                  <p className="text-nimo-dark">
                    Setiap pembelian adalah langkah nyata mengurangi jejak
                    karbon.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          {/* Kartu Mitra Seller */}
          <div className="group bg-[var(--nimo-gray)] p-8 rounded-2xl border border-black hover:border-nimo-yellow hover:bg-white dark:hover:bg-gray-500 transition-all duration-300 shadow-md hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 text-center text-nimo-dark">
              Untuk Anda, Para Mitra Bisnis
            </h3>
            <ul className="space-y-6">
              <li className="flex items-center">
                <TrendingUp className="h-10 w-10 text-nimo-yellow mr-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg">Stok Berlebih Jadi Cuan</h4>
                  <p className="text-nimo-dark">
                    Ubah potensi kerugian menjadi pendapatan tambahan.
                  </p>
                </div>
              </li>
              <li className="flex items-center">
                <Leaf className="h-10 w-10 text-nimo-yellow mr-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg">Brand Peduli Lingkungan</h4>
                  <p className="text-nimo-dark">
                    Tunjukkan komitmen bisnismu pada isu keberlanjutan dan tarik
                    simpati pelanggan.
                  </p>
                </div>
              </li>
              <li className="flex items-center">
                <Users className="h-10 w-10 text-nimo-yellow mr-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg">Jangkauan Konsumen Baru</h4>
                  <p className="text-nimo-dark">
                    Dapatkan pelanggan baru yang peduli, loyal, dan antusias
                    dengan misi Anda.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
