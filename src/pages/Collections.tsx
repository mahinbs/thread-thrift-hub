import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { sampleClothingItems } from "@/data/sampleClothingData";
import { CLOTHING_CATEGORIES } from "@/types/clothing";
import CollectionHeader from "@/components/CollectionHeader";
import CategoryShowcase from "@/components/CategoryShowcase";
import FilterSidebar from "@/components/FilterSidebar";
import EnhancedProductCard from "@/components/EnhancedProductCard";
import { Button } from "@/components/ui/button";
import { FilterOptions } from "@/types/clothing";
import { SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ViewMode = "grid" | "list";

const Collections = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  
  // Initialize filters
  const initialFilters: FilterOptions = {
    categories: category ? [category] : [],
    subcategories: searchParams.get('subcategory') ? [searchParams.get('subcategory')!] : [],
    sizes: [],
    materials: [],
    conditions: [],
    priceRange: [0, 200],
    brands: [],
    status: ["Available"],
    tags: [],
    inStock: true,
    gender: [],
    occasion: [],
    season: [],
    fitType: [],
    printType: [],
    styleCategory: [],
    sleeveType: [],
    necklineType: []
  };
  
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  // Get collection info
  const collectionInfo = useMemo(() => {
    const categoryData = CLOTHING_CATEGORIES.find(cat => cat.id === category);
    
    if (!categoryData) {
      return {
        title: "Collection",
        subtitle: "Pre-loved. Stylish. Sustainable.",
        subcategories: []
      };
    }

    const getTitleFromCategory = (categoryId: string) => {
      const titleMap: Record<string, string> = {
        'mens-formal': "Men's Formal Wear",
        'mens-casual': "Men's Casual Wear", 
        'mens-traditional': "Men's Traditional Wear",
        'mens-activewear': "Men's Active Wear",
        'mens-denim': "Men's Denim Collection",
        'mens-outerwear': "Men's Outerwear",
        'womens-tops': "Women's Tops",
        'womens-traditional': "Women's Traditional Wear",
        'womens-dresses': "Women's Dresses",
        'womens-bottoms': "Women's Bottoms",
        'womens-layering': "Women's Layering",
        'kids-infant': "Infant Wear",
        'kids-toddler': "Toddler Clothing",
        'kids-school': "School Wear",
        'footwear': "Footwear",
        'bags': "Bags Collection",
        'accessories': "Fashion Accessories"
      };
      return titleMap[categoryId] || categoryData.name;
    };

    return {
      title: getTitleFromCategory(category!),
      subtitle: "Pre-loved. Stylish. Sustainable.",
      subcategories: categoryData.subcategories
    };
  }, [category]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let products = sampleClothingItems;

    // Filter by category
    if (category) {
      products = products.filter(item => item.category === category);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.brand.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // Apply other filters
    if (filters.subcategories.length > 0) {
      products = products.filter(item => filters.subcategories.includes(item.subCategory));
    }

    if (filters.sizes.length > 0) {
      products = products.filter(item =>
        item.sizes.some(size => filters.sizes.includes(size))
      );
    }

    if (filters.materials.length > 0) {
      products = products.filter(item =>
        item.materials.some(material => filters.materials.includes(material))
      );
    }

    if (filters.conditions.length > 0) {
      products = products.filter(item => filters.conditions.includes(item.condition));
    }

    if (filters.brands.length > 0) {
      products = products.filter(item => filters.brands.includes(item.brand));
    }

    if (filters.gender.length > 0) {
      products = products.filter(item => filters.gender.includes(item.gender));
    }

    if (filters.occasion.length > 0) {
      products = products.filter(item => filters.occasion.includes(item.occasion));
    }

    if (filters.styleCategory.length > 0) {
      products = products.filter(item => filters.styleCategory.includes(item.styleCategory));
    }

    products = products.filter(item => 
      item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]
    );

    if (filters.inStock) {
      products = products.filter(item => item.stockCount > 0);
    }

    return products;
  }, [category, searchQuery, filters]);

  // Calculate subcategory item counts
  const subcategoryItemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    
    collectionInfo.subcategories.forEach(subcategory => {
      counts[subcategory.id] = sampleClothingItems.filter(item =>
        item.category === category && item.subCategory === subcategory.id
      ).length;
    });
    
    return counts;
  }, [category, collectionInfo.subcategories]);

  const handleWishlist = (id: string) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(id)) {
      newWishlist.delete(id);
      toast({ title: "Removed from wishlist" });
    } else {
      newWishlist.add(id);
      toast({ title: "Added to wishlist" });
    }
    setWishlist(newWishlist);
  };

  const handleShowInterest = (id: string) => {
    toast({ title: "Interest shown! We'll contact you soon." });
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearchQuery("");
    setSearchParams({});
  };

  const getGridClassName = () => {
    if (viewMode === "list") {
      return "max-w-4xl mx-auto space-y-6";
    }
    return "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8 place-items-center";
  };

  if (!category) {
    return <div>Collection not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <CollectionHeader
        category={category}
        title={collectionInfo.title}
        subtitle={collectionInfo.subtitle}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        itemCount={filteredProducts.length}
      />
      
      <CategoryShowcase
        category={category}
        subcategories={collectionInfo.subcategories}
        itemCounts={subcategoryItemCounts}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="mb-4"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Sidebar Filters */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onClear={clearFilters}
              itemCount={filteredProducts.length}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Mode Toggle */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {filteredProducts.length} items
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length > 0 ? (
              <div className={getGridClassName()}>
                {filteredProducts.map((item) => (
                  <div key={item.id} className={viewMode === "grid" ? "w-full max-w-sm mx-auto" : "w-full"}>
                    <EnhancedProductCard
                      {...item}
                      onWishlist={() => handleWishlist(item.id)}
                      onShowInterest={() => handleShowInterest(item.id)}
                      isWishlisted={wishlist.has(item.id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No items found</p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collections;