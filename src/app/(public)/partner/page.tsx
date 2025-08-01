'use client';

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "./(sections)/HeroPartner";
import Benefits from "./(sections)/KeyBenefits";
import HowItWorks from "./(sections)/HowItWorks";
import Testimonials from "./(sections)/Testimonials";
import CtaSection from "./(sections)/CtaSection";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const PartnerPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        <Navbar />
        <div className="bg-[var(--background)] text-[var(--nimo-dark)] transition-colors duration-300 overflow-x-hidden">
          <HeroSection />
          <Benefits />
          <HowItWorks />
          <Testimonials />
          <CtaSection />
        </div>
        <Footer />
        <ScrollToTopButton/>
      </div>
    </main>
  );
};

export default PartnerPage;