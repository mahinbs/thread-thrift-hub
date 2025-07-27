import { useState, useMemo } from "react";
import { Grid, List, SlidersHorizontal, Sparkles, TrendingUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import EnhancedProductCard from "./EnhancedProductCard";
import FilterSidebar from "./FilterSidebar";
import SmartSearch from "./SmartSearch";
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
  inStock: false,
  gender: [],
  occasion: [],
  season: [],
  fitType: [],
  printType: [],
  styleCategory: [],
  sleeveType: [],
  necklineType: []
};
const ProductGrid = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('masonry');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [showTrending, setShowTrending] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const {
    toast
  } = useToast();

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = sampleClothingItems.filter(item => {
      // Search query filter
      if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.brand.toLowerCase().includes(searchQuery.toLowerCase()) && !item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
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
          const conditionOrder = {
            'Like New': 5,
            'Excellent': 4,
            'Good': 3,
            'Gently Used': 2,
            'Vintage': 1
          };
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
      const newWishlist = prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id];
      const item = sampleClothingItems.find(item => item.id === id);
      toast({
        title: prev.includes(id) ? "Removed from wishlist" : "Added to wishlist",
        description: item?.title
      });
      return newWishlist;
    });
  };
  const handleShowInterest = (id: string) => {
    const item = sampleClothingItems.find(item => item.id === id);
    toast({
      title: "Interest shown!",
      description: `We'll contact you about "${item?.title}"`
    });
  };
  const handleQuickView = (id: string) => {
    // Add to recently viewed
    setRecentlyViewed(prev => [id, ...prev.filter(viewedId => viewedId !== id).slice(0, 9)]);
    toast({
      title: "Quick view",
      description: "Quick view modal would open here"
    });
  };
  const handleSmartSearch = (query: string) => {
    setSearchQuery(query);
  };
  const handleVoiceSearch = () => {
    toast({
      title: "Voice Search",
      description: "Voice search activated! Speak your query."
    });
  };
  const handleVisualSearch = () => {
    toast({
      title: "Visual Search",
      description: "Camera would open to search by image."
    });
  };
  const handleAIRecommendation = () => {
    setShowTrending(!showTrending);
    toast({
      title: "AI Recommendations",
      description: showTrending ? "Hiding trending items" : "Showing trending items based on your style!"
    });
  };
  const clearFilters = () => {
    setFilters(initialFilters);
    setSearchQuery("");
  };
  const getGridClassName = () => {
    switch (viewMode) {
      case 'masonry':
        return 'columns-1 sm:columns-2 lg:columns-3 2xl:columns-4 gap-6 space-y-0 w-full';
      case 'list':
        return 'flex flex-col gap-6 max-w-4xl mx-auto w-full';
      case 'grid':
      default:
        return 'card-grid';
    }
  };
  return <section className="py-16 bg-gradient-to-b from-background via-background/50 to-muted/20 neural-bg min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 bg-gradient-eco bg-clip-text text-transparent">
            Sustainable Fashion Collection
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our curated selection with AI-powered search and personalized recommendations
          </p>
        </div>

        {/* Smart Search */}
        <div className="mb-8 animate-slide-in-left">
          <SmartSearch onSearch={handleSmartSearch} onVoiceSearch={handleVoiceSearch} onVisualSearch={handleVisualSearch} onAIRecommendation={handleAIRecommendation} />
        </div>

        {/* Trending Items Banner */}
        {showTrending && <Card className="mb-8 p-4 bg-gradient-eco/10 border-primary/20 animate-scale-in">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary animate-bounce-gentle" />
              <span className="font-semibold text-primary">Trending Now</span>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              AI-curated items based on current fashion trends and your browsing history
            </p>
          </Card>}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && <Card className="mb-8 p-4 bg-muted/30 border-border/50 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Recently Viewed</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {recentlyViewed.slice(0, 5).map(id => {
            const item = sampleClothingItems.find(item => item.id === id);
            return item ? <Badge key={id} variant="secondary" className="whitespace-nowrap cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors interactive" onClick={() => handleQuickView(id)}>
                    {item.title}
                  </Badge> : null;
          })}
            </div>
          </Card>}

        {/* Filter Controls */}
        <div className="bg-background/95 border border-border/50 rounded-lg p-6 mb-8 shadow-card">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

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
                <Button variant={viewMode === 'masonry' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('masonry')} className="rounded-r-none">
                  <Grid className="h-4 w-4" />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setViewMode('list')} className="rounded-none border-x">
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
                    <FilterSidebar filters={filters} onFiltersChange={setFilters} onClear={clearFilters} itemCount={filteredAndSortedProducts.length} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Results Summary */}
          
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <FilterSidebar filters={filters} onFiltersChange={setFilters} onClear={clearFilters} itemCount={filteredAndSortedProducts.length} />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredAndSortedProducts.length === 0 ? <div className="bg-background/95 border border-border/50 rounded-lg p-12 text-center shadow-card">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No items found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </div> : <div className={`${getGridClassName()}`} style={{minHeight: '400px'}}>
                {filteredAndSortedProducts.map((item, index) => (
                  <EnhancedProductCard 
                    key={item.id}
                    {...item} 
                    onWishlist={handleWishlist} 
                    onQuickView={handleQuickView} 
                    onShowInterest={handleShowInterest} 
                    isWishlisted={wishlist.includes(item.id)}
                    className={`${viewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''} transition-all duration-300`}
                  />
                ))}
              </div>}
          </div>
        </div>
      </div>
    </section>;
};
export default ProductGrid;