"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import Head from "next/head"; 

const faqData = [
  {
    question: "Apa itu NOMI?",
    answer:
      "NOMI adalah aplikasi yang membantu mengurangi limbah makanan dengan menghubungkan UMKM, restoran, dan toko roti dengan pembeli. Lewat NOMI, Anda bisa membeli makanan berkualitas yang belum terjual di akhir hari dengan harga diskon hingga 70%.",
  },
  
  {
    question: "Apakah makanan yang dijual benar-benar aman dikonsumsi?",
    answer:
      "Ya! Semua makanan yang tersedia adalah stok berlebih yang masih segar dan layak konsumsi. Mitra kami sudah memastikan standar kebersihan dan kualitasnya sebelum dijual di NOMI.",
  },
  {
    question: "Mengapa saya harus membeli makanan lewat NOMI?",
    answer:
      "Dengan membeli lewat NOMI, Anda bukan hanya mendapatkan makanan enak dengan harga miring 🍱, tapi juga berperan aktif mengurangi food waste yang berkontribusi pada perubahan iklim.",
  },
  
  {
    question: "Bagaimana cara mendaftarkan bisnis saya di NOMI?",
    answer:
      "Mudah! Kunjungi halaman 'Jadi Mitra' di aplikasi atau situs kami, isi formulir pendaftaran, dan tim NOMI akan menghubungi Anda untuk memulai perjalanan sebagai mitra penyelamat makanan.",
  },
 
  {
    question: "Siapa saja yang bisa menggunakan NOMI?",
    answer:
      "Semua orang! Baik Anda konsumen yang mencari makanan hemat, atau pemilik bisnis yang ingin meminimalkan kerugian dari stok berlebih.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqData.map(item => ({
    "@type": "Question",
    "name": item.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.answer
    }
  }))
};


const Faqs = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <Head>
        <title>FAQ Nimo - Pertanyaan yang Sering Diajukan</title>
        <meta name="description" content="Temukan jawaban untuk pertanyaan umum seputar Nimo, mulai dari cara kerja aplikasi, keamanan makanan, hingga cara mendaftar sebagai mitra bisnis." />
        <meta name="keywords" content="faq Nimo, tanya jawab, bantuan Nimo, cara pakai Nimo, makanan diskon, limbah makanan, food waste, mitra Nimo" />
        
        <meta property="og:title" content="FAQ Nimo" />
        <meta property="og:description" content="Semua yang perlu Anda tahu tentang Nimo, layanan kami, dan cara kerja aplikasi. Temukan jawabannya di sini!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nimo.id/faq" />
        <meta property="og:site_name" content="Nimo" />
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="FAQ Nimo" />
        <meta name="twitter:description" content="Punya pertanyaan? Cek FAQ kami untuk jawaban cepat seputar aplikasi Nimo." />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema)
          }}
        />
      </Head>

      <section
        id="faqs"
        className="py-16 md:py-24 bg-white dark:bg-[var(--background)] transition-colors duration-300"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
              Frequently Asked Questions
            </h3>
            <p className="text-[var(--nimo-dark)] mt-3 text-lg max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan paling umum di sini. Jika Anda
              tidak menemukannya, jangan ragu untuk menghubungi kami.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left p-5 bg-gray-800 hover:bg-gray-700/60 transition-colors"
                >
                  <span className="font-semibold text-white">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-nimo-yellow transform transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-500 ease-in-out overflow-hidden ${
                    openIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="p-5 bg-white dark:bg-gray-800">
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Faqs;