// app/page.tsx

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/app/(public)/home/Hero";
import About from "@/app/(public)/home/About";
import Mission from "@/app/(public)/home/Mission";
import HowItWorks from "@/app/(public)/home/HowItWorks";
import Categories from "@/app/(public)/home/Categories";
import Deals from "@/app/(public)/home/Deals";
import CTA from "@/app/(public)/home/CTA";
import Contact from "@/app/(public)/home/Contact";
import Faqs from "@/app/(public)/home/Faqs";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="w-full">
        <Navbar />
        <Hero />
        <About />
        <Mission />
        <HowItWorks />
        <Categories />
        <Deals />
        <CTA />
        <Contact />
        <Faqs />
        <Footer />
        <ScrollToTopButton />
      </div>
    </main>
  );
}