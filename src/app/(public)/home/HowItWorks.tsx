import React from "react";
import Head from "next/head";
import { UploadCloud, MapPin, ShoppingBag } from "lucide-react";

const steps = [
  {
    icon: <UploadCloud size={36} className="text-nimo-yellow" />,
    title: "Mitra Mengunggah Deal",
    description:
      "Restoran atau toko membagikan informasi makanan berlebih yang siap diselamatkan.",
  },
  {
    icon: <MapPin size={36} className="text-nimo-yellow" />,
    title: "Temukan Penawaran Menarik",
    description:
      "Jelajahi NOMI dan temukan berbagai flash deal lezat di sekitar Anda melalui peta interaktif.",
  },
  {
    icon: <ShoppingBag size={36} className="text-nimo-yellow" />,
    title: "Pesan & Ambil Makanan",
    description:
      "Pesan langsung di aplikasi dengan harga spesial, lalu ambil makanan favorit Anda di lokasi mitra.",
  },
];

// Siapkan structured data (Schema.org) untuk SEO
const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Cara Kerja Nomi",
  "description": "Ikuti 3 langkah mudah untuk menyelamatkan makanan dan mendapatkan diskon.",
  "image": {
    "@type": "ImageObject",
    "url": "https://nimo.id/images/how-it-works-banner.png" // Ganti dengan URL gambar relevan
  },
  "step": steps.map((step, index) => ({
    "@type": "HowToStep",
    "url": `https://nimo.id/how-it-works#step-${index + 1}`, // URL unik per langkah
    "name": step.title,
    "text": step.description,
    "image": {
      "@type": "ImageObject",
      "url": "https://nimo.id/images/how-it-works-icon.png" // Ganti dengan URL ikon yang relevan
    }
  }))
};

const HowItWorks = () => {
  return (
    <>
      <Head>
        <title>Cara Kerja Nomi - Selangkah demi Selangkah</title>
        <meta name="description" content="Pelajari cara kerja Nomi dalam 3 langkah mudah: mitra mengunggah deal, Anda menemukan penawaran menarik di sekitar, lalu memesan dan mengambil makanan dengan harga diskon." />
        <meta name="keywords" content="cara pakai Nomi, langkah mudah, food waste, aplikasi makanan, beli makanan diskon, ambil makanan, Nomi" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Cara Kerja Nomi: Selangkah demi Selangkah" />
        <meta property="og:description" content="Hanya dengan 3 langkah mudah, Anda bisa menyelamatkan makanan dan mendapatkan deal menarik di Nomi." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nimo.id/how-it-works" />
        <meta property="og:site_name" content="Nomi" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Cara Kerja Nomi" />
        <meta name="twitter:description" content="Mau tahu bagaimana cara menyelamatkan makanan dan berhemat? Pelajari 3 langkah mudahnya di sini!" />
        
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToSchema)
          }}
        />
      </Head>

      <section
        id="how-it-works"
        className="py-24 bg-[var(--nimo-gray)] transition-colors duration-300"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-24">
            <h3 className="text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
              Semudah Itu!
            </h3>
            <p className="text-[var(--nimo-dark)] mt-3 text-lg">
              Hanya dalam 3 langkah mudah untuk menyelamatkan makanan.
            </p>
          </div>

          <div className="relative flex flex-col md:flex-row items-start justify-center">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div className="relative flex flex-col items-center text-center w-full md:w-64 lg:w-72 px-4">
                  <div
                    className="absolute -top-16 flex items-center justify-center w-12 h-12 
                    bg-nimo-yellow border-2 border-nimo-yellow dark:border-gray-800 
                    text-black rounded-full font-semibold text-xl shadow-md"
                  >
                    {index + 1}
                  </div>
                  <div
                    className="flex justify-center items-center 
                    bg-nimo-light
                    rounded-full h-32 w-32 mx-auto 
                    shadow-lg border-4 border-nimo-light
                    mb-6 transition-colors duration-300"
                  >
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-[var(--nimo-dark)]">
                    {step.title}
                  </h4>
                  <p className="text-[var(--nimo-dark)] text-base leading-relaxed h-24">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:flex-1 md:block h-32 w-full md:w-auto self-start mt-2 lg:mx-4">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 200 100"
                      preserveAspectRatio="none"
                    >
                      {index % 2 === 0 ? (
                        <path
                          d="M 10,50 Q 100,0 190,50"
                          stroke="#FFD600"
                          strokeWidth="2.5"
                          fill="none"
                          strokeDasharray="8,8"
                        />
                      ) : (
                        <path
                          d="M 10,50 Q 100,100 190,50"
                          stroke="#FFD600"
                          strokeWidth="2.5"
                          fill="none"
                          strokeDasharray="8,8"
                        />
                      )}
                    </svg>
                  </div>
                )}
                {index < steps.length - 1 && (
                  <div className="md:hidden h-20 w-px bg-gray-300 dark:bg-gray-600 my-4"></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;