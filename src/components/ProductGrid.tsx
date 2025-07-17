import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

// Sample data - will be replaced with real data
const sampleProducts = [
  {
    id: "1",
    name: "Vintage Levi's Denim Jacket",
    brand: "Levi's",
    price: 45,
    originalPrice: 89,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    size: "M",
    condition: "Excellent",
    category: "Jackets"
  },
  {
    id: "2",
    name: "Cozy Wool Sweater",
    brand: "H&M",
    price: 25,
    originalPrice: 49,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
    size: "L",
    condition: "Good",
    category: "Sweaters"
  },
  {
    id: "3",
    name: "Classic White Button-Up",
    brand: "Uniqlo",
    price: 18,
    originalPrice: 35,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
    size: "S",
    condition: "Like New",
    category: "Shirts"
  },
  {
    id: "4",
    name: "Vintage Band T-Shirt",
    brand: "Vintage",
    price: 32,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    size: "M",
    condition: "Good",
    category: "T-Shirts"
  },
  {
    id: "5",
    name: "Designer Black Dress",
    brand: "Zara",
    price: 55,
    originalPrice: 120,
    image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop",
    size: "M",
    condition: "Excellent",
    category: "Dresses"
  },
  {
    id: "6",
    name: "Casual Summer Shorts",
    brand: "Gap",
    price: 15,
    originalPrice: 32,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop",
    size: "L",
    condition: "Good",
    category: "Shorts"
  }
];

const ProductGrid = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated selection of quality pre-loved clothing. 
            Each piece is carefully inspected and ready for its next adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="px-8">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;