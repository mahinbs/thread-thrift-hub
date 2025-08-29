import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AIScanner from "@/components/AIScanner";
import ProductGrid from "@/components/ProductGrid";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Authentication Banner */}
      {!user && (
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border-b border-primary/20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">
                    Sign in to unlock premium features
                  </p>
                  <p className="text-sm text-muted-foreground">
                    AI scanning, selling, and personalized recommendations
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-primary hover:bg-primary/90"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Hero />
      <AIScanner />
      <ProductGrid />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
