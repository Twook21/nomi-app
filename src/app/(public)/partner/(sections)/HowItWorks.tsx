import React from "react";
import Image from "next/image";

const steps = [
    {
        title: "Unggah Produk Cepat",
        description: "Fotokan produk surplus Anda, tentukan harga diskon, dan publikasikan penawaran dalam beberapa klik."
    },
    {
        title: "Terima Notifikasi Pesanan",
        description: "Sistem kami akan memberitahu Anda secara instan saat pelanggan melakukan pemesanan."
    },
    {
        title: "Siapkan & Verifikasi Pengambilan",
        description: "Pelanggan datang ke lokasi Anda. Cukup scan QR code untuk verifikasi pesanan yang mudah dan aman."
    }
];

const HowItWorks = () => {
    return (
        <section className="bg-[var(--background)] py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Kolom Timeline */}
                    <div className="relative">
                       <h2 className="text-3xl sm:text-4xl font-bold text-[var(--nimo-dark)] mb-10">
                            Proses Mudah & Cepat
                        </h2>
                        {/* Garis Vertikal */}
                        <div className="absolute left-4 top-22 pb-12 md:h-70 sm:h-75 border-l-2 border-dashed border-nimo-yellow/50"></div>
                        
                        <div className="space-y-12">
                            {steps.map((step, index) => (
                                <div key={index} className="relative pl-12">
                                    <div className="absolute left-0 top-1 flex items-center justify-center h-8 w-8 bg-nimo-yellow rounded-full text-white font-bold">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-bold text-[var(--nimo-dark)] mb-2">{step.title}</h3>
                                    <p className="text-[var(--nimo-dark)]/80">{step.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Kolom Gambar */}
                     <div className="w-full h-96 bg-[var(--nimo-gray)] rounded-2xl p-4">
                        <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg">
                             <Image
                                src="/image/dashboard.png" 
                                alt="Dashboard Manajemen Mitra NIMO"
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HowItWorks;