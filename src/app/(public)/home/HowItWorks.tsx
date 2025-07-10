import React from 'react';
import { UploadCloud, MapPin, ShoppingBag } from 'lucide-react';

const steps = [
    {
        icon: <UploadCloud size={36} className="text-nimo-yellow" />,
        title: "Mitra Mengunggah Deal",
        description: "Restoran atau toko membagikan informasi makanan berlebih yang siap diselamatkan."
    },
    {
        icon: <MapPin size={36} className="text-nimo-yellow" />,
        title: "Temukan Penawaran Menarik",
        description: "Jelajahi NIMO dan temukan berbagai flash deal lezat di sekitar Anda melalui peta interaktif."
    },
    {
        icon: <ShoppingBag size={36} className="text-nimo-yellow" />,
        title: "Pesan & Ambil Makanan",
        description: "Pesan langsung di aplikasi dengan harga spesial, lalu ambil makanan favorit Anda di lokasi mitra."
    }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-[var(--nimo-gray)] transition-colors duration-300">
      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h3 className="text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">Semudah Itu!</h3>
          <p className="text-[var(--nimo-dark)] mt-3 text-lg">Hanya dalam 3 langkah mudah untuk menyelamatkan makanan.</p>
        </div>
        
        <div className="relative flex flex-col md:flex-row items-start justify-center">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className="relative flex flex-col items-center text-center w-full md:w-64 lg:w-72 px-4">
                <div className="absolute -top-16 flex items-center justify-center w-12 h-12 
                  bg-nimo-yellow border-2 border-nimo-yellow dark:border-gray-800 
                  text-[var(--nimo-dark)] rounded-full font-semibold text-xl shadow-md">
                  {index + 1}
                </div>
                <div className="flex justify-center items-center 
                  bg-nimo-light
                  rounded-full h-32 w-32 mx-auto 
                  shadow-lg border-4 border-nimo-light
                  mb-6 transition-colors duration-300">
                  {step.icon}
                </div>
                {/* Text Content */}
                <h4 className="text-xl font-bold mb-3 text-[var(--nimo-dark)]">{step.title}</h4>
                <p className="text-[var(--nimo-dark)] text-base leading-relaxed h-24">{step.description}</p>
              </div>

              {/* Connector Line for Desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex-1 md:block h-32 w-full md:w-auto self-start mt-2 lg:mx-4">
                  {/* Warna garis sudah menggunakan warna aksen, tidak perlu diubah */}
                  <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                    {index % 2 === 0 ? (
                      <path d="M 10,50 Q 100,0 190,50" stroke="#FFD600" strokeWidth="2.5" fill="none" strokeDasharray="8,8"/>
                    ) : (
                      <path d="M 10,50 Q 100,100 190,50" stroke="#FFD600" strokeWidth="2.5" fill="none" strokeDasharray="8,8"/>
                    )}
                  </svg>
                </div>
              )}
              {/* Connector Line for Mobile (diberi warna) */}
              {index < steps.length - 1 && (
                 <div className="md:hidden h-20 w-px bg-gray-300 dark:bg-gray-600 my-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks;