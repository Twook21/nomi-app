'use client';

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/app/(public)/home/Hero";
import About from "@/app/(public)/home/About";
import Mission from "@/app/(public)/home/Mission";
import HowItWorks from "@/app/(public)/home/HowItWorks";
import Deals from "@/app/(public)/home/Deals";
import CTA from "@/app/(public)/home/CTA";
import Contact from "@/app/(public)/home/Contact";
import Faqs from "@/app/(public)/home/Faqs";
import Footer from "@/components/Footer";

export default function Home() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        <Navbar />
        <Hero />
        <About />
        <Mission />
        <HowItWorks />
        <Deals />
        <CTA />
        <Contact />
        <Faqs />
        <Footer />
        {showButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-nimo-yellow text-white px-4 py-2 rounded-full shadow-lg hover:bg-nimo-yellow-700 transition cursor-pointer"
            aria-label="Back to top"
          >
            ↑ Top
          </button>
        )}
      </div>
    </main>
  );
}