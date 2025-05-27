import {
  AboutSection,
  ContactSection,
  HeroSection,
  OurPartnersSection,
  ProductsSection,
} from "./sections"

export default function Home() {
  return (
    <main className="w-full overflow-hidden">
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <OurPartnersSection />
      <ContactSection />
    </main>
  )
}
