import { Button } from "@/components/ui/button";
import { Recycle, Heart, Leaf } from "lucide-react";
import heroImage from "@/assets/hero-clothes.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Sustainable fashion collection"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center md:text-left">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Sustainable Fashion
            <span className="block text-primary-glow">Made Simple</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-xl">
            Discover quality pre-loved clothing that's good for your wallet and the planet. 
            Join our community of conscious fashion lovers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="eco" size="lg" className="text-lg px-8 py-6">
              Start Shopping
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10">
              Learn More
            </Button>
          </div>

          {/* Feature Icons */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/80">
            <div className="flex items-center space-x-2">
              <Recycle className="h-5 w-5 text-primary-glow" />
              <span className="text-sm">Eco-Friendly</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary-glow" />
              <span className="text-sm">Quality Curated</span>
            </div>
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-primary-glow" />
              <span className="text-sm">Sustainable</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;