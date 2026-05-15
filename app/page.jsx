import AboutSection from "./components/AboutSection";
import HeroSection from "./components/HeroSection";
import ProcessSection from "./components/ProcessSection";
import ServiceMarquee from "./components/ServiceMarquee";
import ServicesSection from "./components/ServicesSection";
import SiteEffects from "./components/SiteEffects";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import TestimonialsSection from "./components/TestimonialsSection";

export default function Home() {
  return (
    <>
      <SiteEffects />
      <SiteHeader />

      <main id="top">
        <HeroSection />
        <TestimonialsSection />
        <ServiceMarquee />
        <AboutSection />
        <ServicesSection />
        <ProcessSection />
      </main>

      <SiteFooter />
    </>
  );
}
