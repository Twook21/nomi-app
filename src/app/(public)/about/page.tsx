'use client';

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "./(sections)/HeroSection";
import OurStorySection from "./(sections)/OurStorySection";
import ImpactSection from "./(sections)/ImpactSection";
import MissionVisionSection from "./(sections)/MissionVisionSection";
import BenefitsSection from "./(sections)/BenefitsSection";
import TimelineSection from "./(sections)/TimelineSection";
// import TeamSection from "./(sections)/TeamSection";
import CtaSection from "./(sections)/CtaSection";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const AboutPage = () => {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        <Navbar />
        <div className="bg-[var(--background)] text-[var(--nimo-dark)] transition-colors duration-300 overflow-x-hidden">
          <HeroSection />
          <OurStorySection />
          <ImpactSection />
          <MissionVisionSection />
          <BenefitsSection />
          <TimelineSection />
          {/* <TeamSection /> */}
          <CtaSection />
        </div>
        <Footer />
        <ScrollToTopButton/>
      </div>
    </main>
  );
};

export default AboutPage;