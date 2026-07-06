import { Navbar } from '@/components/marketing/navbar';
import { Hero } from '@/components/marketing/hero';
import { Brands } from '@/components/marketing/brands';
import { Services } from '@/components/marketing/services';
import { Stats } from '@/components/marketing/stats';
import { Invoice } from '@/components/marketing/invoice';
import { Testimonials } from '@/components/marketing/testimonials';
import { Pricing } from '@/components/marketing/pricing';
import Integration from '@/components/marketing/integration';
import { Contact } from '@/components/marketing/contact';
import { Faq } from '@/components/marketing/faq';
import { Footer } from '@/components/marketing/footer';

export default function LandingPage() {
  return (
    // A main wrapper that adapts to light/dark background colors
    <main className="bg-background min-h-screen">
      <Navbar />
      <Hero />
      <Brands />
      <Services />
      <Stats />
      <Invoice />
      <Testimonials />
      <Pricing />
      <Integration />
      <Faq />
      <Contact />
      <Footer />
    </main>
  );
}