import React from 'react';
import { MapPin, ShoppingBag, Smile } from 'lucide-react';

const steps = [
  {
    icon: <MapPin className="h-10 w-10 text-nimo-yellow" />,
    title: "1. Temukan Deal",
    description: "Jelajahi peta dan temukan penawaran makanan lezat di sekitarmu.",
  },
  {
    icon: <ShoppingBag className="h-10 w-10 text-nimo-yellow" />,
    title: "2. Pesan & Bayar",
    description: "Amankan porsi makananmu langsung dari aplikasi dengan beberapa ketukan.",
  },
  {
    icon: <Smile className="h-10 w-10 text-nimo-yellow" />,
    title: "3. Ambil & Nikmati",
    description: "Datang ke lokasi, tunjukkan QR code, dan nikmati makananmu dengan harga spesial.",
  },
];

const HowItWorksCustomer = () => {
    return (
        <section className="bg-[var(--nimo-gray)] py-16 md:py-24">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[var(--nimo-dark)]">
                        Semudah 1-2-3
                    </h2>
                    <p className="mt-4 text-lg text-[var(--nimo-dark)]/80">
                        Menikmati makanan enak dengan harga miring tidak pernah semudah ini.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 text-center">
                    {steps.map((step, index) => (
                        <div key={index}>
                            <div className="flex justify-center items-center h-24 w-24 mx-auto mb-6 bg-white rounded-full shadow-md">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-[var(--nimo-dark)] mb-2">{step.title}</h3>
                            <p className="text-[var(--nimo-dark)]/80 leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorksCustomer;