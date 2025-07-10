import React from "react";
import Image from "next/image";
import { Heart, DollarSign, Globe } from "lucide-react";
import Link from "next/link";


const Mission = () => {
  return (
    // Mengubah background utama agar dinamis
    <section
      id="mission"
      className="py-16 md:py-24 bg-[var(--background)] transition-colors duration-300"
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center mb-12 md:mb-20">
          {/* Mengganti shadow dengan border di dark mode */}
          <div className="relative w-full h-56 sm:h-72 md:h-80 rounded-2xl overflow-hidden shadow-2xl dark:shadow-none dark:border dark:border-gray-700">
            <Image
              src="/image/mission.png"
              alt="Ilustrasi menyelamatkan makanan"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <span className="text-nimo-yellow font-semibold uppercase tracking-wider text-xl sm:text-2xl">
              #Misi Kami
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--nimo-dark)] leading-snug">
              Mengubah Makanan Berlebih Menjadi Berkah
            </h2>
            {/* Menambahkan warna teks untuk dark mode */}
            <p className="text-[var(--nimo-dark)] leading-relaxed text-base sm:text-lg">
              <span className="text-nimo-yellow font-bold">NIMO </span>lahir
              dari sebuah gagasan sederhana, bagaimana jika kita bisa
              menghubungkan makanan lezat yang berlebih dengan orang-orang yang
              ingin menikmatinya?
            </p>
            {/* Menambahkan warna teks untuk dark mode */}
            <p className="text-[var(--nimo-dark)] leading-relaxed text-base">
              Aplikasi kami adalah jembatan antara UMKM & Mitra lain yang
              bergerak di bidang F&B yang memiliki surplus makanan dengan Anda.
              Kami percaya, setiap makanan layak untuk dinikmati, bukan dibuang.
            </p>

            <div className="pt-4">
              <Link href="/tentang">
                <button className="inline-block bg-nimo-yellow text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-500 dark:hover:bg-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Pelajari Lebih Lanjut
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 text-center">
          <div className="bg-[var(--nimo-gray)] p-6 sm:p-8 rounded-xl shadow-inner transform transition-all duration-300 hover:shadow-lg dark:hover:shadow-none hover:border hover:border-nimo-yellow">
            <div className="flex justify-center p-2 items-center mb-4 bg-nimo-yellow text-white h-14 w-14 sm:h-16 sm:w-16 mx-auto rounded-full">
              <DollarSign size={28} />
            </div>
            <h4 className="text-lg sm:text-xl font-bold mb-2 text-nimo-yellow">
              Hemat Pengeluaran
            </h4>
            <p className="text-[var(--nimo-dark)] text-base">
              Dapatkan makanan berkualitas dengan diskon besar. Pilihan cerdas
              untuk kantong Anda.
            </p>
          </div>
          {/* Kartu Misi 2 */}
          <div className="bg-[var(--nimo-gray)] p-6 sm:p-8 rounded-xl shadow-inner transform transition-all duration-300 hover:shadow-lg dark:hover:shadow-none hover:border hover:border-nimo-yellow">
            <div className="flex justify-center p-2 items-center mb-4 bg-nimo-yellow text-white h-14 w-14 sm:h-16 sm:w-16 mx-auto rounded-full">
              <Heart size={28} />
            </div>
            <h4 className="text-lg sm:text-xl font-bold mb-2 text-nimo-yellow">
              Dukung Bisnis Lokal
            </h4>
            <p className="text-[var(--nimo-dark)] text-base">
              Bantu restoran, kafe atau UMKM favorit Anda mengurangi kerugian
              dan tetap bertahan.
            </p>
          </div>
          {/* Kartu Misi 3 */}
          <div className="bg-[var(--nimo-gray)] p-6 sm:p-8 rounded-xl shadow-inner transform transition-all duration-300 hover:shadow-lg dark:hover:shadow-none hover:border hover:border-nimo-yellow">
            <div className="flex justify-center p-2 items-center mb-4 bg-nimo-yellow text-white h-14 w-14 sm:h-16 sm:w-16 mx-auto rounded-full">
              <Globe size={28} />
            </div>
            <h4 className="text-lg sm:text-xl font-bold mb-2 text-nimo-yellow">
              Selamatkan Bumi
            </h4>
            <p className="text-[var(--nimo-dark)] text-base">
              Setiap pembelian berarti Anda turut andil dalam mengurangi jejak
              karbon.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
