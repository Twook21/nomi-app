import React from 'react';
import Link from 'next/link';

const CtaSection = () => {
    return (
        <section className="bg-nimo-yellow">
            <div className="container mx-auto px-4 sm:px-6 py-16 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-nimo-light mb-4">
                    Siap Mengubah Sisa Makanan Menjadi Keuntungan?
                </h2>
                <p className="text-lg text-nimo-light max-w-2xl mx-auto mb-8">
                    Proses pendaftaran hanya 5 menit. Bergabunglah dengan ratusan bisnis lain yang telah merasakan manfaatnya.
                </p>
                <Link href="/register-partner">
                     <button className="bg-nimo-light text-nimo-yellow font-bold py-3 px-8 rounded-full text-lg hover:bg-gray-200 transition-colors duration-300">
                        Daftarkan Bisnis Anda
                    </button>
                </Link>
            </div>
        </section>
    );
}

export default CtaSection;