import React from 'react';
import Image from 'next/image';
import {
  Target,
  Rocket,
  Users,
  Heart,
  Smile,
  ShieldCheck,
  TrendingUp,
  Leaf,
  CheckCircle,
  Building,
  MapPin,
  Globe,
} from 'lucide-react';

const AboutPage = () => {
  return (
    <main className="bg-[var(--background)] text-[var(--nimo-dark)] transition-colors duration-300">
      {/* 1. Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
                Tentang <span className="text-nimo-yellow">NIMO</span> –
                <br />
                Selamatkan Makanan, Selamatkan Bumi
              </h1>
              <p className="mt-6 text-lg md:text-xl leading-relaxed max-w-xl mx-auto md:mx-0">
                NIMO adalah marketplace makanan berlebih pertama di Indonesia yang membantu penjual mengubah stok mendekati kadaluarsa menjadi keuntungan, sekaligus memberikan akses makanan berkualitas dengan harga lebih murah bagi konsumen.
              </p>
            </div>
            <div className="relative w-full h-64 md:h-96">
              {/* Ganti dengan path ilustrasi Anda */}
              <Image
                src="/image/about-hero.svg" 
                alt="Ilustrasi orang membeli makanan diskon"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Story */}
      <section id="story" className="py-16 md:py-24 bg-[var(--nimo-gray)]">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Mengapa Kami Memulai <span className="text-nimo-yellow">NIMO</span>?
          </h2>
          <p className="text-lg leading-relaxed mb-8">
            Setiap tahun, 1,3 miliar ton makanan terbuang sia-sia di dunia. Di Indonesia sendiri, sampah makanan (food waste) tidak hanya menyumbang emisi karbon yang merusak planet kita, tetapi juga menyebabkan kerugian ekonomi yang sangat besar. NIMO lahir sebagai solusi sederhana namun berdampak: menjembatani penjual makanan berlebih dengan para pembeli cerdas yang ingin berhemat tanpa mengorbankan kualitas.
          </p>
          <blockquote className="border-l-4 border-nimo-yellow pl-6 py-2 italic text-xl font-medium text-left">
            “Kami percaya setiap makanan layak mendapatkan kesempatan kedua untuk dinikmati, bukan dibuang.”
          </blockquote>
        </div>
      </section>
      
      {/* 3. Impact Goals (Data Dampak -> Tujuan) */}
      <section id="impact" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Target Dampak Awal Kami</h2>
            <p className="mt-4 text-lg text-[var(--nimo-dark)] max-w-2xl mx-auto">
              Kami memulai dengan tujuan yang jelas. Ini adalah target yang ingin kami capai bersama Anda dalam 6 bulan pertama peluncuran.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-[var(--nimo-gray)] p-8 rounded-2xl">
              <Leaf className="h-12 w-12 mx-auto text-nimo-yellow mb-4" />
              <p className="text-4xl font-bold text-nimo-yellow">5 ton</p>
              <h4 className="mt-2 text-xl font-semibold">Makanan Terselamatkan</h4>
            </div>
            <div className="bg-[var(--nimo-gray)] p-8 rounded-2xl">
              <Smile className="h-12 w-12 mx-auto text-nimo-yellow mb-4" />
              <p className="text-4xl font-bold text-nimo-yellow">10.000+</p>
              <h4 className="mt-2 text-xl font-semibold">Porsi Terjual</h4>
            </div>
            <div className="bg-[var(--nimo-gray)] p-8 rounded-2xl">
              <Users className="h-12 w-12 mx-auto text-nimo-yellow mb-4" />
              <p className="text-4xl font-bold text-nimo-yellow">500+</p>
              <h4 className="mt-2 text-xl font-semibold">Mitra Bisnis Bergabung</h4>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Our Mission & Vision */}
      <section id="mission-vision" className="py-16 md:py-24 bg-[var(--nimo-gray)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Visi Kami</h3>
              <p className="text-xl leading-relaxed italic">
                “Menjadi platform utama pengurangan food waste di Asia Tenggara, menciptakan ekosistem pangan yang lebih berkelanjutan untuk semua.”
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4">Misi Kami</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-nimo-yellow mr-3 mt-1 flex-shrink-0" />
                  <span>Memberdayakan penjual makanan (UMKM, kafe, restoran) untuk mengoptimalkan stok dan mengurangi kerugian.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-nimo-yellow mr-3 mt-1 flex-shrink-0" />
                  <span>Memberikan akses makanan lezat dan terjangkau bagi seluruh lapisan masyarakat.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-6 w-6 text-nimo-yellow mr-3 mt-1 flex-shrink-0" />
                  <span>Mengurangi dampak lingkungan dari food waste melalui aksi kolektif berbasis teknologi.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Why Join NIMO? */}
      <section id="benefits" className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Mengapa Bergabung dengan Gerakan NIMO?</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-[var(--nimo-gray)] p-8 rounded-2xl border border-transparent hover:border-nimo-yellow transition-all">
              <h3 className="text-2xl font-bold mb-6 text-center">✅ Untuk Konsumen</h3>
              <ul className="space-y-5">
                <li className="flex items-center">
                  <Heart className="h-8 w-8 text-nimo-yellow mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold">Harga Makanan Lebih Hemat</h4>
                    <p className="text-sm">Nikmati hidangan favoritmu dengan diskon besar setiap hari.</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <ShieldCheck className="h-8 w-8 text-nimo-yellow mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold">Kualitas Tetap Terjamin</h4>
                    <p className="text-sm">Kami bekerja sama dengan mitra terpercaya untuk memastikan makanan tetap layak dan lezat.</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <Globe className="h-8 w-8 text-nimo-yellow mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold">Berkontribusi Selamatkan Bumi</h4>
                    <p className="text-sm">Setiap pembelian adalah langkah nyata mengurangi jejak karbon.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="bg-[var(--nimo-gray)] p-8 rounded-2xl border border-transparent hover:border-nimo-yellow transition-all">
              <h3 className="text-2xl font-bold mb-6 text-center">✅ Untuk Mitra Seller</h3>
              <ul className="space-y-5">
                <li className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-nimo-yellow mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold">Stok Berlebih Jadi Cuan</h4>
                    <p className="text-sm">Ubah potensi kerugian menjadi pendapatan tambahan.</p>
                  </div>
                </li>
                 <li className="flex items-center">
                  <Leaf className="h-8 w-8 text-nimo-yellow mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold">Brand Lebih Peduli Lingkungan</h4>
                    <p className="text-sm">Tunjukkan komitmen bisnismu pada isu keberlanjutan.</p>
                  </div>
                </li>
                <li className="flex items-center">
                  <Users className="h-8 w-8 text-nimo-yellow mr-4 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold">Jangkauan Konsumen Baru</h4>
                    <p className="text-sm">Dapatkan pelanggan baru yang peduli dan loyal.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Timeline (Perjalanan NIMO) */}
      <section id="timeline" className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold">Perjalanan yang Akan Kita Lalui</h2>
                  <p className="mt-4 text-lg max-w-2xl mx-auto">Dari ide hingga menjadi gerakan nasional, inilah peta jalan kami.</p>
              </div>
              <div className="relative">
                  {/* The vertical line */}
                  <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-nimo-yellow/30"></div>
                  
                  <div className="space-y-16 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-16">
                      {/* Timeline Item 1 */}
                      <div className="flex md:justify-end">
                          <div className="md:text-right md:w-2/3 p-6 bg-[var(--nimo-gray)] rounded-lg shadow-md">
                              <p className="font-bold text-nimo-yellow">Awal 2025</p>
                              <h4 className="text-xl font-semibold mt-1">Ide & Validasi Konsep</h4>
                              <p className="mt-2 text-sm">NIMO lahir dari riset mendalam tentang masalah food waste dan kebutuhan pasar di Indonesia.</p>
                          </div>
                      </div>
                      <div className="hidden md:block"></div>
                      
                      <div className="hidden md:block"></div>
                      {/* Timeline Item 2 */}
                      <div className="flex md:justify-start">
                          <div className="md:w-2/3 p-6 bg-[var(--nimo-gray)] rounded-lg shadow-md">
                              <p className="font-bold text-nimo-yellow">Pertengahan 2025</p>
                              <h4 className="text-xl font-semibold mt-1">Peluncuran Platform & Mitra Perdana</h4>
                              <p className="mt-2 text-sm">Platform NIMO resmi diluncurkan di Jabodetabek, menggandeng 100 mitra pertama.</p>
                          </div>
                      </div>

                      {/* Timeline Item 3 */}
                      <div className="flex md:justify-end">
                          <div className="md:text-right md:w-2/3 p-6 bg-[var(--nimo-gray)] rounded-lg shadow-md">
                              <p className="font-bold text-nimo-yellow">Akhir 2025</p>
                              <h4 className="text-xl font-semibold mt-1">Peluncuran Aplikasi Mobile</h4>
                              <p className="mt-2 text-sm">Aplikasi NIMO hadir di iOS & Android untuk pengalaman yang lebih mudah dan cepat.</p>
                          </div>
                      </div>
                       <div className="hidden md:block"></div>

                      <div className="hidden md:block"></div>
                      {/* Timeline Item 4 */}
                       <div className="flex md:justify-start">
                           <div className="md:w-2/3 p-6 bg-[var(--nimo-gray)] rounded-lg shadow-md">
                              <p className="font-bold text-nimo-yellow">2026 & Kedepannya</p>
                              <h4 className="text-xl font-semibold mt-1">Ekspansi Nasional</h4>
                              <p className="mt-2 text-sm">Membawa misi NIMO ke kota-kota besar lain di seluruh Indonesia.</p>
                           </div>
                       </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 7. Meet the Team (Optional) */}
      <section id="team" className="py-16 md:py-24 bg-[var(--nimo-gray)]">
        <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tim di Balik <span className="text-nimo-yellow">NIMO</span>
          </h2>
          <p className="text-lg leading-relaxed mb-10">
            Kami adalah tim kecil yang terdiri dari para pegiat teknologi, pencinta kuliner, dan aktivis lingkungan dengan satu misi besar: mengubah cara kita memandang dan mengelola makanan.
          </p>
          <div className="flex justify-center space-x-4">
              {/* Ganti dengan foto tim Anda */}
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-nimo-yellow">
                  <Image src="/image/team-placeholder-1.jpg" alt="Foto Tim 1" layout="fill" objectFit="cover" />
              </div>
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-nimo-yellow">
                  <Image src="/image/team-placeholder-2.jpg" alt="Foto Tim 2" layout="fill" objectFit="cover" />
              </div>
              <div className="relative h-24 w-24 rounded-full overflow-hidden border-2 border-nimo-yellow">
                  <Image src="/image/team-placeholder-3.jpg" alt="Foto Tim 3" layout="fill" objectFit="cover" />
              </div>
          </div>
        </div>
      </section>
      
      {/* 8. Call to Action */}
      <section id="cta" className="py-20 md:py-28 bg-cover bg-center" style={{ backgroundImage: "url('/image/cta-background.jpg')"}}>
        <div className="bg-black/60 absolute inset-0"></div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative text-white">
            <h2 className="text-4xl md:text-5xl font-extrabold">Jadilah Bagian dari Perubahan</h2>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                Gabung bersama kami untuk menciptakan dunia tanpa food waste, satu hidangan dalam satu waktu.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <a
                  href="/register/consumer"
                  className="inline-block bg-nimo-yellow text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-500 transition-all duration-300 shadow-lg w-full sm:w-auto"
                >
                  Gabung Sebagai Konsumen
                </a>
                <a
                  href="/register/seller"
                  className="inline-block bg-white text-[var(--nimo-dark)] font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-200 transition-all duration-300 shadow-lg w-full sm:w-auto"
                >
                  Gabung Sebagai Mitra
                </a>
            </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;