import { PublicNav } from "@/components/public/PublicNav";
import { PublicFooter } from "@/components/public/PublicFooter";
import { Marquee } from "@/components/public/Marquee";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { GallerySection } from "@/components/sections/GallerySection";
import { CraftSection } from "@/components/sections/CraftSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <main className="surface-canvas min-h-screen">
        <HeroSection />
        <Marquee
          variant="brick"
          items={[
            "Reserva en línea",
            "Oficio desde 2014",
            "Corte · Barba · Afeitado",
            "Café de cortesía",
            "Estilo editorial",
          ]}
        />
        <ServicesSection />
        <GallerySection />
        <CraftSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <PublicFooter />
    </>
  );
}
