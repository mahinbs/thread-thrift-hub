import { useState, useMemo } from "react";
import { Search, Grid, List, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import EnhancedProductCard from "./EnhancedProductCard";
import FilterSidebar from "./FilterSidebar";
import { sampleClothingItems } from "@/data/sampleClothingData";
import { FilterOptions, ClothingItem } from "@/types/clothing";

type SortOption = 'newest' | 'price-low' | 'price-high' | 'name' | 'condition';
type ViewMode = 'grid' | 'masonry' | 'list';

const initialFilters: FilterOptions = {
  categories: [],
  subcategories: [],
  sizes: [],
  materials: [],
  conditions: [],
  priceRange: [0, 1000],
  brands: [],
  status: ['Available'],
  tags: [],
  inStock: false
};

const ProductGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('masonry');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const { toast } = useToast();

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = sampleClothingItems.filter((item) => {
      // Search query filter
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.brand.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Category filters
      if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
        return false;
      }

      if (filters.subcategories.length > 0 && !filters.subcategories.includes(item.subCategory)) {
        return false;
      }

      // Size filters
      if (filters.sizes.length > 0 && !filters.sizes.some(size => item.sizes.includes(size))) {
        return false;
      }

      // Material filters
      if (filters.materials.length > 0 && !filters.materials.some(material => item.materials.includes(material))) {
        return false;
      }

      // Condition filters
      if (filters.conditions.length > 0 && !filters.conditions.includes(item.condition)) {
        return false;
      }

      // Price range filter
      if (item.price < filters.priceRange[0] || item.price > filters.priceRange[1]) {
        return false;
      }

      // Brand filters
      if (filters.brands.length > 0 && !filters.brands.includes(item.brand)) {
        return false;
      }

      // Status filters
      if (filters.status.length > 0 && !filters.status.includes(item.status)) {
        return false;
      }

      // In stock filter
      if (filters.inStock && item.stockCount === 0) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.title.localeCompare(b.title);
        case 'condition':
          const conditionOrder = { 'Like New': 5, 'Excellent': 4, 'Good': 3, 'Gently Used': 2, 'Vintage': 1 };
          return conditionOrder[b.condition] - conditionOrder[a.condition];
        case 'newest':
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
    });

    return filtered;
  }, [searchQuery, filters, sortBy]);

  const handleWishlist = (id: string) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id];
      
      const item = sampleClothingItems.find(item => item.id === id);
      toast({
        title: prev.includes(id) ? "Removed from wishlist" : "Added to wishlist",
        description: item?.title,
      });
      
      return newWishlist;
    });
  };

  const handleShowInterest = (id: string) => {
    const item = sampleClothingItems.find(item => item.id === id);
    toast({
      title: "Interest shown!",
      description: `We'll contact you about "${item?.title}"`,
    });
  };

  const handleQuickView = (id: string) => {
    toast({
      title: "Quick view",
      description: "Quick view modal would open here",
    });
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setSearchQuery("");
  };

  const getGridClassName = () => {
    switch (viewMode) {
      case 'masonry':
        return 'masonry-grid';
      case 'list':
        return 'flex flex-col gap-4';
      case 'grid':
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6';
    }
  };

  return (
    <section className="py-16 bg-muted/30 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Sustainable Fashion Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated selection of quality pre-loved clothing. 
            Each piece is carefully inspected and ready for its next adventure.
          </p>
        </div>

        {/* Search and Controls */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, brand, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort */}
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="condition">Best Condition</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === 'masonry' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('masonry')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-none border-x"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Filter Toggle */}
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar
                      filters={filters}
                      onFiltersChange={setFilters}
                      onClear={clearFilters}
                      itemCount={filteredAndSortedProducts.length}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {filteredAndSortedProducts.length} items
              </Badge>
              {wishlist.length > 0 && (
                <Badge variant="outline">
                  ❤️ {wishlist.length} wishlisted
                </Badge>
              )}
            </div>
            
            {(searchQuery || filters.categories.length > 0 || filters.sizes.length > 0) && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all filters
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onClear={clearFilters}
              itemCount={filteredAndSortedProducts.length}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </div>
            ) : (
              <div className={getGridClassName()}>
                {filteredAndSortedProducts.map((item) => (
                  <EnhancedProductCard
                    key={item.id}
                    {...item}
                    onWishlist={handleWishlist}
                    onQuickView={handleQuickView}
                    onShowInterest={handleShowInterest}
                    isWishlisted={wishlist.includes(item.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;