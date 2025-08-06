import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AIScanner from "@/components/AIScanner";
import ProductGrid from "@/components/ProductGrid";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <AIScanner />
      <ProductGrid />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
