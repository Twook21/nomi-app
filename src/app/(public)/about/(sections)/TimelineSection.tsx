import React from "react";

const TimelineSection = () => {
  return (
    <section id="timeline" className="py-20 md:py-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold">
            Perjalanan yang Akan Kita Lalui
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Dari ide hingga menjadi gerakan nasional, inilah peta jalan kami.
          </p>
        </div>
        <div className="relative max-w-4xl mx-auto">
          {/* Garis Vertikal */}
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-nimo-yellow/30 transform -translate-x-1/2"></div>

          {/* Item Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16">
            {/* Item 1 */}
            <div className="md:pr-16 relative">
              <div className="md:text-right p-6 bg-white rounded-lg shadow-xl border border-gray-100">
                <p className="font-bold text-nimo-yellow">Awal 2025</p>
                <h4 className="text-xl font-semibold mt-1">
                  Ide & Validasi Konsep
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  NIMO lahir dari riset mendalam tentang masalah food waste dan
                  kebutuhan pasar di Indonesia.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-[17px] transform -translate-y-1/2 h-4 w-4 rounded-full bg-nimo-yellow border-4 border-white"></div>
            </div>
            <div></div>

            <div></div>
            {/* Item 2 */}
            <div className="md:pl-16 relative">
              <div className="p-6 bg-white rounded-lg shadow-xl border border-gray-100">
                <p className="font-bold text-nimo-yellow">Pertengahan 2025</p>
                <h4 className="text-xl font-semibold mt-1">
                  Peluncuran Platform & Mitra Perdana
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  Platform NIMO resmi diluncurkan di Jabodetabek, menggandeng
                  100 mitra pertama.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -left-[17px] transform -translate-y-1/2 h-4 w-4 rounded-full bg-nimo-yellow border-4 border-white"></div>
            </div>

            {/* Item 3 */}
            <div className="md:pr-16 relative">
              <div className="md:text-right p-6 bg-white rounded-lg shadow-xl border border-gray-100">
                <p className="font-bold text-nimo-yellow">Akhir 2025</p>
                <h4 className="text-xl font-semibold mt-1">
                  Peluncuran Aplikasi Mobile
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  Aplikasi NIMO hadir di iOS & Android untuk pengalaman yang
                  lebih mudah dan cepat.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -right-[17px] transform -translate-y-1/2 h-4 w-4 rounded-full bg-nimo-yellow border-4 border-white"></div>
            </div>
            <div></div>

            <div></div>
            {/* Item 4 */}
            <div className="md:pl-16 relative">
              <div className="p-6 bg-white rounded-lg shadow-xl border border-gray-100">
                <p className="font-bold text-nimo-yellow">2026 & Kedepannya</p>
                <h4 className="text-xl font-semibold mt-1">
                  Ekspansi Nasional
                </h4>
                <p className="mt-2 text-sm text-gray-600">
                  Membawa misi NIMO ke kota-kota besar lain di seluruh
                  Indonesia.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 -left-[17px] transform -translate-y-1/2 h-4 w-4 rounded-full bg-nimo-yellow border-4 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
