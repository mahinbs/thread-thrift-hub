import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Truck, Recycle, Star, Users, Leaf } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Quality Guaranteed",
    description: "Every item is carefully inspected and authenticated before listing."
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and secure shipping with tracking for all orders."
  },
  {
    icon: Recycle,
    title: "Eco-Friendly",
    description: "Reduce fashion waste by giving clothes a second life."
  },
  {
    icon: Star,
    title: "Curated Selection",
    description: "Hand-picked items from trusted brands and quality materials."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Join thousands of conscious fashion enthusiasts."
  },
  {
    icon: Leaf,
    title: "Sustainable Impact",
    description: "Make a positive environmental impact with every purchase."
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose ReThread?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to making sustainable fashion accessible, affordable, and enjoyable for everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="text-center border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader className="pb-4">
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;