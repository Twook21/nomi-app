"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Moon } from "lucide-react";

const menuItems = [
  { href: "/", label: "Beranda" },
  { href: "/about", label: "Tentang" },
  { href: "/partner", label: "Mitra" },
  { href: "/customer", label: "Konsumen" },
  // { href: "/blogs", label: "Blogs" },
  // { href: "/faqs", label: "FAQs" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("theme") || "light"
      : "light"
  );

  const pathname = usePathname();

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleMenuClick = () => {
    setMenuOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  const ThemeToggleButton = () => (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                 bg-gray-200 dark:bg-gray-700 
                 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-nimo-yellow focus:ring-offset-2
                 dark:focus:ring-offset-gray-800`}
      aria-label="Toggle Dark Mode"
    >
      <span
        className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 
                   transition duration-200 ease-in-out
                   ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`}
      >
        <span
          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity
                     ${
                       theme === "light"
                         ? "opacity-100 ease-in duration-200"
                         : "opacity-0 ease-out duration-100"
                     }`}
          aria-hidden="true"
        >
          <Sun className="h-4 w-4 text-gray-500" />
        </span>
        <span
          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity
                     ${
                       theme === "dark"
                         ? "opacity-100 ease-in duration-200"
                         : "opacity-0 ease-out duration-100"
                     }`}
          aria-hidden="true"
        >
          <Moon className="h-4 w-4 text-nimo-yellow" />
        </span>
      </span>
    </button>
  );

  return (
    <nav className="bg-[var(--nimo-light)] shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <Link href="/">
          <h1 className="text-2xl font-bold text-nimo-yellow cursor-pointer">
            NOMI
          </h1>
        </Link>
        <div className="hidden md:flex ml-20 items-center space-x-8">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[var(--nimo-dark)] font-medium transition-colors relative ${
                isActive(item.href) ? "text-nimo-yellow" : ""
              } hover:text-nimo-yellow after:content-[''] after:block after:h-0.5 after:bg-nimo-yellow after:transition-all after:duration-300 after:absolute after:left-0 after:-bottom-1 ${
                isActive(item.href)
                  ? "after:w-full"
                  : "after:w-0 hover:after:w-full"
              } `}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center">
          <div className="md:hidden flex items-center">
            <button
              className="text-[var(--nimo-dark)] focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 8h16M4 16h16"
                  />
                )}
              </svg>
            </button>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/auth/login">
              <button className="bg-transparent text-[var(--nimo-dark)] font-semibold py-2 px-4 rounded-full hover:bg-[var(--nimo-gray)] transition-colors">
                Login
              </button>
            </Link>
            <Link href="/auth/register">
              <button className="bg-nimo-yellow text-white font-semibold py-2 px-4 rounded-full hover:opacity-90 transition-opacity">
                Daftar
              </button>
            </Link>
            <ThemeToggleButton />
          </div>
        </div>
      </div>
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMenuOpen(false)}
      />
      <div
        className={`md:hidden fixed top-0 right-0 w-4/5 max-w-xs h-full bg-[var(--nimo-light)] shadow-lg z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } `}
      >
        <div className="flex flex-col h-full px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <Link href="/">
              <h1 className="text-2xl font-bold text-nimo-yellow cursor-pointer">
                NOMI
              </h1>
            </Link>
            <div className="flex items-center space-x-2">
              <ThemeToggleButton />
              <button
                className="text-[var(--nimo-dark)] focus:outline-none"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <svg
                  className="w-7 h-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-2 flex-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleMenuClick}
                className={`text-[var(--nimo-dark)] font-medium py-2 px-2 rounded transition-colors ${
                  isActive(item.href)
                    ? "text-nimo-yellow bg-[var(--nimo-gray)]"
                    : "hover:text-nimo-yellow"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex space-x-2 pt-4">
            <Link href="/auth/login" className="flex-1">
              <button className="w-full bg-transparent text-[var(--nimo-dark)] font-semibold py-2 px-4 rounded-full border border-[var(--nimo-gray)] hover:bg-[var(--nimo-gray)] transition-colors">
                Login
              </button>
            </Link>
            <Link href="/auth/register" className="flex-1">
              <button className="w-full bg-nimo-yellow text-white font-semibold py-2 px-4 rounded-full hover:opacity-90 transition-opacity">
                Daftar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
