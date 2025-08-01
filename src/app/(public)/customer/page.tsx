"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "./(sections)/HeroCustomer";
import UserBenefits from "./(sections)/UserBenefits";
import HowItWorks from "./(sections)/HowItWorksCustomer";
import CtaCustomer from "./(sections)/CtaCustomer";
import AppPreview from "./(sections)/AppPreview";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const CustomerPage = () => {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        <Navbar />
        <div className="bg-[var(--background)] text-[var(--nimo-dark)] transition-colors duration-300 overflow-x-hidden">
          <HeroSection />
          <UserBenefits />
          <HowItWorks />
          <AppPreview />
          <CtaCustomer />
        </div>
        <Footer />
       <ScrollToTopButton/>
      </div>
    </main>
  );
};

export default CustomerPage;
