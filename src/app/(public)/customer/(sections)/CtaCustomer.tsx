import React from 'react';
import Link from 'next/link';

const CtaCustomer = () => {
    return (
        <section className="bg-[var(--background)]">
            <div className="container mx-auto px-4 sm:px-6 py-20">
                <div className="bg-[var(--nimo-dark)] rounded-2xl p-10 md:p-16 text-center text-nimo-light">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Tunggu Apa Lagi?
                    </h2>
                    <p className="text-lg text-nimo-light max-w-2xl mx-auto mb-8">
                        Ribuan porsi makanan lezat menantimu dengan harga miring. Mulai petualangan kulinermu sekarang!
                    </p>
                    <Link href="/products">
                         <button className="bg-nimo-yellow text-white font-bold py-3 px-10 rounded-full text-lg hover:bg-yellow-500 transition-colors duration-300">
                            Mulai Berhemat Sekarang
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default CtaCustomer;