import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-nimo-light">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-2xl font-bold text-nimo-yellow mb-4 md:mb-0">NIMO</h2>
          <div className="flex space-x-6 text-gray-400">
            <a href="#features" className="hover:text-nimo-yellow transition-colors">Fitur</a>
            <a href="#recipes" className="hover:text-nimo-yellow transition-colors">Resep</a>
            <a href="#" className="hover:text-nimo-yellow transition-colors">Privasi</a>
            <a href="#" className="hover:text-nimo-yellow transition-colors">Kontak</a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} NIMO. Semua Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;