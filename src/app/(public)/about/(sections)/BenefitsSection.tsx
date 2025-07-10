import next from "next";
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
            Mengapa Bergabung dengan Gerakan NIMO?
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-10">
          {/* Kartu Konsumen */}
          <div className="group bg-[var(--nimo-gray)] p-8 rounded-2xl border border-transparent hover:border-nimo-yellow hover:bg-white transition-all duration-300 shadow-md hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">
              Untuk Anda, Para Penyelamat Rasa
            </h3>
            <ul className="space-y-6">
              <li className="flex items-center">
                <Heart className="h-10 w-10 text-nimo-yellow mr-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg">
                    Harga Makanan Lebih Hemat
                  </h4>
                  <p className="text-gray-600">
                    Nikmati hidangan favoritmu dengan diskon besar setiap hari.
                  </p>
                </div>
              </li>
              <li className="flex items-center">
                <ShieldCheck className="h-10 w-10 text-nimo-yellow mr-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg">Kualitas Tetap Terjamin</h4>
                  <p className="text-gray-600">
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
                  <p className="text-gray-600">
                    Setiap pembelian adalah langkah nyata mengurangi jejak
                    karbon.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          {/* Kartu Mitra Seller */}
          <div className="group bg-[var(--nimo-gray)] p-8 rounded-2xl border border-transparent hover:border-nimo-yellow hover:bg-white transition-all duration-300 shadow-md hover:shadow-2xl">
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">
              Untuk Anda, Para Mitra Bisnis
            </h3>
            <ul className="space-y-6">
              <li className="flex items-center">
                <TrendingUp className="h-10 w-10 text-nimo-yellow mr-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg">Stok Berlebih Jadi Cuan</h4>
                  <p className="text-gray-600">
                    Ubah potensi kerugian menjadi pendapatan tambahan.
                  </p>
                </div>
              </li>
              <li className="flex items-center">
                <Leaf className="h-10 w-10 text-nimo-yellow mr-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg">Brand Peduli Lingkungan</h4>
                  <p className="text-gray-600">
                    Tunjukkan komitmen bisnismu pada isu keberlanjutan dan tarik
                    simpati pelanggan.
                  </p>
                </div>
              </li>
              <li className="flex items-center">
                <Users className="h-10 w-10 text-nimo-yellow mr-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-lg">Jangkauan Konsumen Baru</h4>
                  <p className="text-gray-600">
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
