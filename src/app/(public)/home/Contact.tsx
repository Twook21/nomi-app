import React from "react";
import Head from "next/head"; // Import Head dari next/head
import { Mail, MessageSquare, Phone } from "lucide-react";

const Contact = () => {
  return (
    <>
      <Head>
        <title>Hubungi Nimo - Layanan Pelanggan & Dukungan</title>
        <meta name="description" content="Butuh bantuan? Hubungi Customer Service Nimo melalui email, WhatsApp, atau telepon. Kami siap membantu Anda terkait pertanyaan, masalah, atau umpan balik." />
        <meta name="keywords" content="kontak Nimo, customer service, dukungan, bantuan, email, WhatsApp, telepon, Nomi, food waste" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="Hubungi Nimo - Kami Siap Membantu!" />
        <meta property="og:description" content="Dapatkan bantuan cepat dari tim Nimo. Hubungi kami melalui berbagai kanal komunikasi yang tersedia." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://nimo.id/kontak" /> {/* Sesuaikan dengan URL halaman kontak Anda */}
        <meta property="og:site_name" content="Nimo" />
        {/* Anda bisa menambahkan og:image jika ada gambar relevan untuk halaman kontak */}
        {/* <meta property="og:image" content="https://nimo.id/images/contact-banner.png" /> */}
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary" /> {/* summary atau summary_large_image */}
        <meta name="twitter:title" content="Hubungi Nimo" />
        <meta name="twitter:description" content="Tim dukungan Nimo siap menjawab pertanyaan Anda. Kontak kami sekarang!" />
        {/* <meta name="twitter:image" content="https://nimo.id/images/contact-banner.png" /> */}
      </Head>

      <section
        id="contact"
        className="py-20 bg-[var(--nimo-gray)] transition-colors duration-300"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-[var(--nimo-dark)]">
              Butuh Bantuan?
            </h3>
            <p className="text-[var(--nimo-dark)] mt-3 text-lg">
              Kami siap membantu Anda. Hubungi Customer Service kami melalui salah
              satu kanal di bawah ini.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white dark:bg-[var(--background)] rounded-2xl shadow-xl dark:shadow-none dark:border dark:border-gray-700 p-8 md:p-12 transition-colors duration-300">
            <h4 className="text-2xl font-bold text-center text-[var(--nimo-dark)] mb-8">
              Hubungi Customer Service <span className="text-bold text-nimo-yellow">NOMI</span>
            </h4>
            <div className="space-y-6">
              <a
                href="mailto:support@nimo.app"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-[var(--nimo-gray)] hover:border-nimo-yellow transition-all"
              >
                <Mail className="w-6 h-6 text-nimo-yellow mr-4 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[var(--nimo-dark)]">Email</p>
                  <p className="text-[var(--nimo-dark)]">support@nimo.app</p>
                </div>
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-[var(--nimo-gray)] hover:border-nimo-yellow transition-all"
              >
                <MessageSquare className="w-6 h-6 text-nimo-yellow mr-4 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[var(--nimo-dark)]">
                    WhatsApp
                  </p>
                  <p className="text-[var(--nimo-dark)]">+62 812-3456-7890</p>
                </div>
              </a>
              {/* Telepon tidak bisa diklik, jadi tidak menggunakan <a> */}
              <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                <Phone className="w-6 h-6 text-nimo-yellow mr-4 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[var(--nimo-dark)]">Telepon</p> {/* Mengubah warna teks agar konsisten */}
                  <p className="text-[var(--nimo-dark)]"> {/* Mengubah warna teks agar konsisten */}
                    (021) 555-0123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;