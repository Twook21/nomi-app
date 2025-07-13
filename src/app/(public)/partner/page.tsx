'use client';

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "./(sections)/HeroPartner";
import Benefits from "./(sections)/KeyBenefits";
import HowItWorks from "./(sections)/HowItWorks";
import Testimonials from "./(sections)/Testimonials";
import CtaSection from "./(sections)/CtaSection";


const PartnerPage = () => {
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
        <div className="bg-[var(--background)] text-[var(--nimo-dark)] transition-colors duration-300 overflow-x-hidden">
          <HeroSection />
          <Benefits />
          <HowItWorks />
          {/* <Testimonials /> */}
          <CtaSection />
        </div>
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
};

export default PartnerPage;