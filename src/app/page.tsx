'use client';

import { use, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Mission from "@/components/Mission";
import HowItWorks from "@/components/HowItWorks";
import Deals from "@/components/Deals";
import CTA from "@/components/CTA";
import Contact from "@/components/Contact";
import Faqs from "@/components/Faqs";
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