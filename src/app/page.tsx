// app/page.tsx

"use client";

import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustedSection from "@/components/landing/TrustedSection";
import FeaturesGrid from "@/components/landing/FeaturesGrid";
import HowItWorks from "@/components/landing/HowItWorks";
import DemoSection from "@/components/landing/DemoSection";
import PricingSection from "@/components/landing/PricingSection";
import SecuritySection from "@/components/landing/SecuritySection";
import Testimonials from "@/components/landing/Testimonials";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <HeroSection />

      <TrustedSection />

      <FeaturesGrid />

      <HowItWorks />

      <DemoSection />

      <PricingSection />

      <SecuritySection />

      <Testimonials />

      <FAQSection />

      <CTASection />

      <Footer />
    </main>
  );
}


