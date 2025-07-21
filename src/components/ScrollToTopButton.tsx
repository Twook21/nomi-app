// components/ScrollToTopButton.tsx

'use client';

import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Tampilkan tombol jika user scroll lebih dari 300px
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    
    // Cleanup event listener saat komponen di-unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  // Tampilkan tombol jika showButton bernilai true
  if (!showButton) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 bg-nimo-yellow text-white p-3 rounded-full shadow-lg hover:bg-nimo-yellow-700 transition-colors duration-300 cursor-pointer z-50"
      aria-label="Kembali ke atas"
    >
      {/* Icon panah ke atas untuk UI/UX yang lebih baik */}
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}