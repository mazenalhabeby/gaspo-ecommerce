import AboutSection from "@/components/sections/home/AboutSection"
import ContactSection from "@/components/sections/home/ContactSection"
import HeroSection from "@/components/sections/home/HeroSection"
import OurPartnersSection from "@/components/sections/home/OurPartnersSection"
import ProductsSection from "@/components/sections/home/ProductsSection"

export default function Home() {
  return (
    <div>
      <main className=" w-full overflow-hidden">
        <HeroSection />
        <AboutSection />
        <ProductsSection />
        <OurPartnersSection />
        <ContactSection />
      </main>
    </div>
  )
}
