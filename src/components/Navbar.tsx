"use client";

import React, { useState, useEffect } from "react";

// --- Bagian ini tetap sama ---
const menuItems = [
  { href: "#hero", label: "Home" },
  { href: "#about", label: "Tentang" },
  { href: "#how-it-works", label: "Cara Kerja" },
  { href: "#deals", label: "Kategori" },
  { href: "#contact", label: "Kontak" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("#hero");
  
  // --- State dan Logic untuk Dark Mode ---
  const [theme, setTheme] = useState("light");

  // Efek untuk mengecek tema saat komponen dimuat pertama kali
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (prefersDark) {
      setTheme("dark");
    }
  }, []);

  // Efek untuk menerapkan class 'dark' pada tag <html>
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // --- Scroll spy effect (tidak berubah) ---
  useEffect(() => {
    const handleScroll = () => {
      let current = menuItems[0].href;
      for (const item of menuItems) {
        const section = document.querySelector(item.href);
        if (section) {
          const rect = (section as HTMLElement).getBoundingClientRect();
          if (rect.top <= 80) {
            current = item.href;
          }
        }
      }
      setActive(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMenuClick = (href: string) => {
    setActive(href);
    setMenuOpen(false);
  };
  
  // --- Komponen Tombol Toggle ---
  const ThemeToggleButton = () => (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-nimo-dark hover:bg-nimo-gray transition-colors"
      aria-label="Toggle Dark Mode"
    >
      {theme === 'light' ? (
        // Ikon Bulan
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
      ) : (
        // Ikon Matahari
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
      )}
    </button>
  );

  return (
    // Gunakan var(--nimo-light) untuk background agar dinamis
    <nav className="bg-[var(--nimo-light)] shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-nimo-yellow">NIMO</h1>
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => handleMenuClick(item.href)}
              // Gunakan var(--nimo-dark) untuk warna teks agar dinamis
              className={`text-[var(--nimo-dark)] font-medium transition-colors relative
                ${active === item.href ? "after:w-full text-nimo-yellow" : ""}
                hover:text-nimo-yellow
                after:content-[''] after:block after:h-0.5 after:bg-nimo-yellow after:transition-all after:duration-300
                after:absolute after:left-0 after:-bottom-1
                ${active === item.href ? "after:w-full" : "after:w-0 hover:after:w-full"}
              `}
            >
              {item.label}
            </a>
          ))}
        </div>
        
        <div className="flex items-center">
            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center">
                <button
                    className="text-[var(--nimo-dark)] focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {/* SVG Ikon Hamburger/Close tidak berubah */}
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16"/>}
                    </svg>
                </button>
            </div>
            
            {/* Tombol Auth & Toggle digabung */}
            <div className="hidden md:flex items-center space-x-2">
                <button className="bg-transparent text-[var(--nimo-dark)] font-semibold py-2 px-4 rounded-full hover:bg-[var(--nimo-gray)] transition-colors">
                    Login
                </button>
                <button className="bg-nimo-yellow text-white font-semibold py-2 px-4 rounded-full hover:opacity-90 transition-opacity">
                    Daftar
                </button>
                {/* --- TAMBAHKAN TOMBOL TOGGLE DI SINI (DESKTOP) --- */}
                <ThemeToggleButton />
            </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`md:hidden fixed top-0 right-0 w-4/5 max-w-xs h-full bg-[var(--nimo-light)] shadow-lg z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-nimo-yellow">NIMO</h1>
            {/* --- TAMBAHKAN TOMBOL TOGGLE DI SINI (MOBILE) --- */}
            <div className="flex items-center space-x-2">
                <ThemeToggleButton />
                <button className="text-[var(--nimo-dark)] focus:outline-none" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 flex-1">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => handleMenuClick(item.href)}
                className={`text-[var(--nimo-dark)] font-medium py-2 px-2 rounded transition-colors ${active === item.href ? "text-nimo-yellow bg-[var(--nimo-gray)]" : "hover:text-nimo-yellow"}`}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex space-x-2 pt-4">
            <button className="flex-1 bg-transparent text-[var(--nimo-dark)] font-semibold py-2 px-4 rounded-full border border-[var(--nimo-gray)] hover:bg-[var(--nimo-gray)] transition-colors cursor-pointer">
              Login
            </button>
            <button className="flex-1 bg-nimo-yellow text-white font-semibold py-2 px-4 rounded-full hover:opacity-90 transition-opacity cursor-pointer">
              Daftar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;