import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import ClientsSection from "@/components/ClientsSection";
import FeaturesSection from "@/components/FeaturesSection";
import WorldMap from "@/components/WorldMap";
import CtaBottomSection from "@/components/CtaBottomSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <StatsSection />
        <ClientsSection />
        <FeaturesSection />
        <WorldMap />
        <CtaBottomSection />
      </main>
      <Footer />
    </div>
  );
}
