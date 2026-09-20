import Authority from "@/components/Authority";
import Hero from "@/components/Hero";
import HowToOrder from "@/components/HowToOrder";
import Newsletter from "@/components/Newsletter";
import SectionFade from "@/components/SectionFade";
import Testimonials from "@/components/Testimonials";
import Tradition from "@/components/Tradition";

export default function Home() {
  return (
    <main>
      <Hero />
      <Authority />
      <SectionFade from="var(--color-cream)" to="var(--color-navy-050)" />
      <Tradition />
      <SectionFade from="var(--color-navy-050)" to="var(--color-white)" />
      <HowToOrder />
      <SectionFade from="var(--color-white)" to="var(--color-navy-050)" />
      <Testimonials />
      <SectionFade
        from="var(--color-navy-050)"
        to="var(--color-navy-900)"
        tall
      />
      <Newsletter />
    </main>
  );
}
