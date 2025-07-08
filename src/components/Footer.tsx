import React from 'react';
// Mengimpor ikon untuk sosial media
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    // Menggunakan var(--nimo-dark) agar konsisten dengan tema
    <footer className="bg-black text-gray-300">
      <div className="container mx-auto px-6 py-12">
        
        {/* Kontainer utama dengan layout grid untuk kolom-kolom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Kolom 1: Brand dan Tagline */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-bold text-nimo-yellow mb-2">NIMO</h2>
            <p className="text-gray-400 text-sm max-w-xs">
              Menyelamatkan makanan lezat berlebih, satu hidangan sekali waktu.
            </p>
          </div>

          {/* Kolom 2: Navigasi Utama */}
          <div>
            <h5 className="font-bold uppercase tracking-wider text-white mb-4">Navigasi</h5>
            <nav className="flex flex-col space-y-2 text-sm">
              <a href="#hero" className="hover:text-nimo-yellow transition-colors">Home</a>
              <a href="#about" className="hover:text-nimo-yellow transition-colors">Tentang</a>
              <a href="#how-it-works" className="hover:text-nimo-yellow transition-colors">Cara Kerja</a>
              <a href="#faqs" className="hover:text-nimo-yellow transition-colors">FAQs</a>
            </nav>
          </div>

          {/* Kolom 3: Legal & Kontak */}
          <div>
            <h5 className="font-bold uppercase tracking-wider text-white mb-4">Lainnya</h5>
            <nav className="flex flex-col space-y-2 text-sm">
              <a href="#contact" className="hover:text-nimo-yellow transition-colors">Hubungi Kami</a>
              <a href="#" className="hover:text-nimo-yellow transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-nimo-yellow transition-colors">Syarat & Ketentuan</a>
            </nav>
          </div>

          {/* Kolom 4: Sosial Media */}
          <div>
            <h5 className="font-bold uppercase tracking-wider text-white mb-4">Ikuti Kami</h5>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-nimo-yellow transition-colors">
                <Facebook size={22} />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-nimo-yellow transition-colors">
                <Instagram size={22} />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-nimo-yellow transition-colors">
                <Twitter size={22} />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-nimo-yellow transition-colors">
                <Linkedin size={22} />
              </a>
            </div>
          </div>

        </div>

        {/* Garis pemisah dan copyright */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} NIMO. Semua Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;