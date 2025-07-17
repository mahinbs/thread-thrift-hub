import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Recycle, Heart, Leaf, Sparkles, TrendingUp, Globe, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-clothes.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero neural-bg">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-glow/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Sustainable fashion collection"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center md:text-left">
        <div className="max-w-4xl animate-fade-in-up">
          <div className="mb-6 animate-slide-in-left">
            <Card className="inline-flex px-4 py-2 bg-primary/10 border-primary/20 animate-pulse-glow">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">AI-Powered Fashion Discovery</span>
              </div>
            </Card>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
            Future of{" "}
            <span className="bg-gradient-to-r from-primary-glow via-primary to-primary-glow bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              Sustainable
            </span>{" "}
            <span className="block">Fashion</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl leading-relaxed">
            Experience the next generation of conscious fashion with AI-powered recommendations, 
            voice search, and immersive AR try-on technology.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 mb-16 animate-slide-in-left">
            <Button variant="eco" size="lg" className="text-xl px-12 py-8 shadow-glow hover-lift">
              Explore AI Search
              <Sparkles className="ml-3 h-6 w-6" />
            </Button>
            <Button variant="outline" size="lg" className="text-xl px-12 py-8 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm">
              Try AR Fitting
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <Card className="text-center p-6 glass-effect hover-neural">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 animate-bounce-gentle">150K+</div>
              <div className="text-white font-semibold">AI Recommendations</div>
            </Card>
            <Card className="text-center p-6 glass-effect hover-neural">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 animate-bounce-gentle" style={{ animationDelay: '0.2s' }}>98%</div>
              <div className="text-white font-semibold">Satisfaction Rate</div>
            </Card>
            <Card className="text-center p-6 glass-effect hover-neural">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2 animate-bounce-gentle" style={{ animationDelay: '0.4s' }}>50K+</div>
              <div className="text-white font-semibold">CO2 Saved (kg)</div>
            </Card>
          </div>

          {/* Enhanced Feature Icons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/80 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <Card className="flex items-center space-x-3 p-4 glass-effect hover-glow interactive">
              <TrendingUp className="h-6 w-6 text-primary animate-bounce-gentle" />
              <span className="font-medium">AI Trends</span>
            </Card>
            <Card className="flex items-center space-x-3 p-4 glass-effect hover-glow interactive">
              <Globe className="h-6 w-6 text-primary animate-bounce-gentle" style={{ animationDelay: '0.5s' }} />
              <span className="font-medium">Global Community</span>
            </Card>
            <Card className="flex items-center space-x-3 p-4 glass-effect hover-glow interactive">
              <Leaf className="h-6 w-6 text-primary animate-bounce-gentle" style={{ animationDelay: '1s' }} />
              <span className="font-medium">Blockchain Verified</span>
            </Card>
          </div>
        </div>
      </div>

      {/* Floating AI indicators */}
      <Card className="absolute top-20 right-10 p-3 glass-effect animate-pulse-glow hidden lg:block">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Analyzing Trends</span>
        </div>
      </Card>
      
      <Card className="absolute bottom-20 left-10 p-3 glass-effect animate-pulse-glow hidden lg:block" style={{ animationDelay: '1s' }}>
        <div className="flex items-center gap-2 text-white">
          <TrendingUp className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">98% Style Match</span>
        </div>
      </Card>
    </section>
  );
};

export default Hero;