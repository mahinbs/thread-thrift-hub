import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Recycle, Heart, Leaf, Sparkles, TrendingUp, Globe, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-clothes.jpg";

const Hero = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleExploreAISearch = () => {
    // Smooth scroll to the search section
    const searchSection = document.querySelector('section:has([class*="SmartSearch"], [data-search-section])');
    
    if (searchSection) {
      searchSection.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    } else {
      // Fallback: scroll to the product grid section which contains search
      const productSection = document.querySelector('section:has([class*="ProductGrid"], [class*="product"])');
      if (productSection) {
        productSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }

    // Show AI search features toast
    toast({
      title: "AI Search Activated! 🚀",
      description: "Try voice search, visual search, or AI-powered recommendations to find your perfect style match.",
    });

    // Add a small delay then highlight the search input
    setTimeout(() => {
      const searchInput = document.querySelector('input[type="text"], input[placeholder*="search" i]');
      if (searchInput) {
        (searchInput as HTMLInputElement).focus();
        // Add a subtle highlight animation
        searchInput.classList.add('animate-pulse-glow');
        setTimeout(() => {
          searchInput.classList.remove('animate-pulse-glow');
        }, 2000);
      }
    }, 1000);
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero neural-bg">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full animate-float animate-morph"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full animate-float animate-morph" style={{
        animationDelay: '2s'
      }}></div>
        <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-accent/15 rounded-full animate-float animate-morph" style={{
        animationDelay: '4s'
      }}></div>
      </div>

      {/* Background Image with enhanced overlay */}
      <div className="absolute inset-0 z-0">
        <img src={heroImage} alt="Next-gen fashion discovery" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center md:text-left">
        <div className="max-w-4xl animate-fade-in-up">
          <div className="mb-6 animate-slide-in-left">
            <Card className="inline-flex px-6 py-3 glass-morphism neon-glow">
              <div className="flex items-center gap-3 text-white">
                <Sparkles className="h-5 w-5 animate-neon-pulse" />
                <span className="text-sm font-bold tracking-wide">🚀 AI-Powered Gen Z Fashion</span>
              </div>
            </Card>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-tight">
            <span className="block">The Future</span>
            <span className="block">is{" "}
            <span className="gradient-text bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              Digital
            </span></span>
            <span className="block text-4xl md:text-6xl lg:text-7xl font-bold mt-4 text-white/80">Fashion Revolution</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl leading-relaxed font-medium">
            Scan, discover, and sell clothes with AI magic ✨ Built for Gen Z who care about style, sustainability, and smart money moves 💰
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mb-16 animate-slide-in-left">
            <Button 
              variant="neon" 
              size="lg" 
              className="text-xl px-16 py-8 font-bold tracking-wide hover-tilt"
              onClick={() => {
                if (user) {
                  navigate('/scan');
                } else {
                  navigate('/auth', { 
                    state: { 
                      message: 'Please sign in to access the AI scanner',
                      returnTo: '/scan'
                    } 
                  });
                }
              }}
            >
              Start Scanning 📱
              <Sparkles className="ml-3 h-6 w-6" />
            </Button>
            <Button 
              variant="glass" 
              size="lg" 
              className="text-xl px-12 py-8 font-semibold backdrop-blur-md"
              onClick={() => {
                if (user) {
                  navigate('/sell');
                } else {
                  navigate('/auth', { 
                    state: { 
                      message: 'Please sign in to start selling your clothes',
                      returnTo: '/sell'
                    } 
                  });
                }
              }}
            >
              Start Selling 💰
            </Button>
          </div>

          {/* Compact Stats Chips */}
          <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-12 animate-fade-in-up" style={{
          animationDelay: '0.5s'
        }}>
            <div className="glass-morphism px-6 py-4 rounded-2xl hover-lift">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black gradient-text">2M+</span>
                <div>
                  <div className="text-white font-semibold text-sm">Items Scanned</div>
                  <div className="text-white/60 text-xs">99.2% AI accuracy</div>
                </div>
              </div>
            </div>
            <div className="glass-morphism px-6 py-4 rounded-2xl hover-lift">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black gradient-text">$50M+</span>
                <div>
                  <div className="text-white font-semibold text-sm">User Earnings</div>
                  <div className="text-white/60 text-xs">Avg $127/item</div>
                </div>
              </div>
            </div>
            <div className="glass-morphism px-6 py-4 rounded-2xl hover-lift">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black gradient-text">98%</span>
                <div>
                  <div className="text-white font-semibold text-sm">Love Rating</div>
                  <div className="text-white/60 text-xs">5-star reviews</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Feature Icons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/80 animate-fade-in-up" style={{
          animationDelay: '0.8s'
        }}>
            
            
            
          </div>
        </div>
      </div>

    </section>;
};
export default Hero;