import { Link } from "react-router-dom";
import { SubCategory } from "@/types/clothing";

interface CategoryShowcaseProps {
  category: string;
  subcategories: SubCategory[];
  itemCounts: Record<string, number>;
}

const CategoryShowcase = ({ category, subcategories, itemCounts }: CategoryShowcaseProps) => {
  // Get sample images for different subcategories
  const getSubcategoryImage = (subcategoryId: string) => {
    const imageMap: Record<string, string> = {
      'formal-shirts': 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=200&fit=crop',
      'blazers': 'https://images.unsplash.com/photo-1594938328870-28ced99bc6aa?w=300&h=200&fit=crop',
      'mens-jeans': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=200&fit=crop',
      'kurta-pajamas': 'https://images.unsplash.com/photo-1583338964115-9c1b770fe4b1?w=300&h=200&fit=crop',
      'sports-tshirts': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop',
      'maxi-dresses': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop',
      'kurtis': 'https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=300&h=200&fit=crop',
      'crop-tops': 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=300&h=200&fit=crop',
      'palazzo-pants': 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=300&h=200&fit=crop',
      'bodycon-dresses': 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=300&h=200&fit=crop',
      'rompers': 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=300&h=200&fit=crop',
      'kids-formal-shirts': 'https://images.unsplash.com/photo-1503919005314-30d93d07d823?w=300&h=200&fit=crop',
      'formal-shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop',
      'handbags': 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=300&h=200&fit=crop',
      'scarves': 'https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=300&h=200&fit=crop'
    };
    
    return imageMap[subcategoryId] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop';
  };

  if (subcategories.length === 0) return null;

  return (
    <div className="bg-muted/20 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          Shop by Category
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {subcategories.slice(0, 6).map((subcategory) => {
            const count = itemCounts[subcategory.id] || 0;
            
            return (
              <Link
                key={subcategory.id}
                to={`/collections/${category}?subcategory=${subcategory.id}`}
                className="group"
              >
                <div className="bg-background rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={getSubcategoryImage(subcategory.id)}
                      alt={subcategory.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {subcategory.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {count} {count === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase;