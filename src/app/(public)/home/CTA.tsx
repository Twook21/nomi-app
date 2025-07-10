import React from 'react';

const CTA = () => {
  return (
    <section id="cta-section" className="bg-nimo-yellow">
      <div className="container mx-auto px-6 py-20 text-center">
        <h3 className="text-3xl md:text-4xl font-bold text-nimo-light mb-4">
          Jangan Biarkan Makanan Terbuang Sia-sia!
        </h3>
        <p className="text-nimo-light mb-8 max-w-2xl mx-auto text-lg">
          Bergabunglah dengan gerakan anti-food waste hari ini. Mulai hemat, bantu sesama, dan selamatkan planet kita.
        </p>
        <button className="bg-nimo-light text-nimo-yellow font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-colors text-lg shadow-md">
          Daftar Sekarang Gratis
        </button>
      </div>
    </section>
  );
};

export default CTA;