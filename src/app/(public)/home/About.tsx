import React from 'react';
import { Store, Smile, Leaf } from 'lucide-react';
import Head from 'next/head';

const aboutData = [
  {
    icon: <Store className="h-8 w-8 text-nimo-yellow" />,
    title: "Untuk Bisnis F&B",
    description: "Ubah makanan berlebih menjadi pendapatan tambahan dan jangkau pelanggan baru."
  },
  {
    icon: <Smile className="h-8 w-8 text-nimo-yellow" />,
    title: "Untuk Masyarakat", 
    description: "Nikmati makanan berkualitas dengan harga yang jauh lebih terjangkau."
  },
  {
    icon: <Leaf className="h-8 w-8 text-nimo-yellow" />,
    title: "Untuk Planet Bumi",
    description: "Setiap makanan yang diselamatkan berarti mengurangi emisi dari TPA."
  }
];

const About = () => {
  return (
    <>
      <Head>
        <title>Tentang Nimo - Solusi Anti Food Waste untuk Bisnis, Masyarakat & Lingkungan</title>
        <meta name="description" content="Nimo menyediakan solusi tiga arah untuk mengatasi food waste: membantu bisnis F&B mengurangi limbah dan meningkatkan profit, memberikan makanan berkualitas dengan harga terjangkau untuk masyarakat, dan melindungi lingkungan dari emisi gas rumah kaca." />
        <meta name="keywords" content="food waste, anti limbah makanan, bisnis F&B, makanan murah, lingkungan, UMKM, sustainability, eco-friendly" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Nimo - Solusi Anti Food Waste Tiga Arah" />
        <meta property="og:description" content="Platform yang menghubungkan bisnis F&B dengan konsumen untuk mengurangi food waste sambil menguntungkan semua pihak dan melindungi lingkungan." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Nimo" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nimo - Solusi Anti Food Waste Tiga Arah" />
        <meta name="twitter:description" content="Kurangi limbah makanan, tingkatkan profit bisnis, hemat pengeluaran konsumen, dan selamatkan lingkungan." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Nimo" />
        <link rel="canonical" href="https://nimo.id/tentang" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Nimo",
              "description": "Platform anti food waste yang menghubungkan bisnis F&B dengan konsumen untuk mengurangi limbah makanan",
              "url": "https://nimo.id",
              "sameAs": [
                "https://instagram.com/nimo.id",
                "https://facebook.com/nimo.id"
              ],
              "foundingDate": "2024",
              "founders": [
                {
                  "@type": "Person",
                  "name": "Tim Nimo"
                }
              ],
              "areaServed": "Indonesia",
              "serviceType": "Food Waste Reduction Platform"
            })
          }}
        />
      </Head>
      
      <section id="about" className="py-16 md:py-24 bg-[var(--nimo-gray)]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--nimo-dark)] mb-3 sm:mb-4">
              Solusi Tiga Arah
            </h3>
            <p className="text-[var(--nimo-dark)] text-base sm:text-lg leading-relaxed">
              Menang untuk bisnis, menang untuk pembeli, dan menang untuk bumi.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {aboutData.map((item, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[var(--background)] p-6 sm:p-8 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex justify-center items-center h-12 w-12 sm:h-14 sm:w-14 bg-nimo-yellow/10 rounded-full">
                    {React.cloneElement(item.icon, { 
                      className: "h-6 w-6 sm:h-8 sm:w-8 text-nimo-yellow" 
                    })}
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-[var(--nimo-dark)]">
                    {item.title}
                  </h4>
                </div>
                <p className="text-[var(--nimo-dark)] text-base leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;