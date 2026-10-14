import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturesSection from "@/components/FeaturesSection";
import ProcessSection from "@/components/ProcessSection";
import WorldMap from "@/components/WorldMap";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturesSection />
        <ProcessSection />
        <WorldMap />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
