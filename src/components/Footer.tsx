import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-bold text-nimo-yellow mb-2">NOMI</h2>
            <p className="text-gray-400 text-sm max-w-xs">
              Menyelamatkan makanan lezat berlebih, satu hidangan sekali waktu.
            </p>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-wider text-white mb-4">
              Navigasi
            </h5>
            <nav className="flex flex-col space-y-2 text-sm">
              <Link
                href="/"
                className="hover:text-nimo-yellow transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="/about"
                className="hover:text-nimo-yellow transition-colors"
              >
                Tentang
              </Link>
              <Link
                href="/partner"
                className="hover:text-nimo-yellow transition-colors"
              >
                Mitra
              </Link>
              <Link
                href="/customer"
                className="hover:text-nimo-yellow transition-colors"
              >
                Konsumen
              </Link>
              {/* <Link
                href="/blogs"
                className="hover:text-nimo-yellow transition-colors"
              >
                Blogs
              </Link> */}
            </nav>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-wider text-white mb-4">
              Lainnya
            </h5>
            <nav className="flex flex-col space-y-2 text-sm">
              <a
                href="#contact"
                className="hover:text-nimo-yellow transition-colors"
              >
                Hubungi Kami
              </a>
              <a href="#" className="hover:text-nimo-yellow transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="hover:text-nimo-yellow transition-colors">
                Syarat & Ketentuan
              </a>
            </nav>
          </div>

          <div>
            <h5 className="font-bold uppercase tracking-wider text-white mb-4">
              Ikuti Kami
            </h5>
            <div className="flex space-x-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-gray-400 hover:text-nimo-yellow transition-colors"
              >
                <Facebook size={22} />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-gray-400 hover:text-nimo-yellow transition-colors"
              >
                <Instagram size={22} />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-gray-400 hover:text-nimo-yellow transition-colors"
              >
                <Twitter size={22} />
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-nimo-yellow transition-colors"
              >
                <Linkedin size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} NOMI. Semua Hak Cipta Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
