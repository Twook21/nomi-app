import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

const Testimonial = () => {
  return (
    <section className="bg-[var(--nimo-gray)] py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <Quote className="absolute -top-8 -left-8 text-nimo-yellow/10 h-24 w-24" />
          <p className="text-2xl md:text-3xl font-light italic text-[var(--nimo-dark)] leading-snug">
            "NIMO mengubah cara kami mengelola surplus. Food cost menurun
            signifikan dan kami mendapatkan pelanggan baru yang loyal. Ini
            adalah win-win solution yang brilian."
          </p>
          <div className="mt-8 flex items-center justify-center">
            <div className="relative w-14 h-14 rounded-full overflow-hidden mr-4">
              <Image
                src="/images/partner-avatar-1.jpg"
                alt="Sarah Widianti"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-lg text-[var(--nimo-dark)]">
                Sarah Widianti
              </h4>
              <p className="text-[var(--nimo-dark)]/70">Pemilik, Kafe Senja</p>
            </div>
          </div>
          <Quote className="absolute -bottom-8 -right-8 text-nimo-yellow/10 h-24 w-24 transform rotate-180" />
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
