import { Search, User, ShoppingBag, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Sync search input with URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchQuery(urlSearch);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter something to search for.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to collections page with search parameter
    const searchParams = new URLSearchParams();
    searchParams.set('search', searchQuery.trim());
    
    // Add some intelligent search routing based on keywords
    if (searchQuery.toLowerCase().includes('dress')) {
      searchParams.set('category', 'womens-dresses');
    } else if (searchQuery.toLowerCase().includes('shirt') || searchQuery.toLowerCase().includes('formal')) {
      searchParams.set('category', 'mens-formal');
    } else if (searchQuery.toLowerCase().includes('jeans') || searchQuery.toLowerCase().includes('denim')) {
      searchParams.set('category', 'mens-denim');
    } else if (searchQuery.toLowerCase().includes('traditional') || searchQuery.toLowerCase().includes('kurti')) {
      searchParams.set('category', 'womens-traditional');
    }

    navigate(`/collections?${searchParams.toString()}`);
    
    toast({
      title: "Searching...",
      description: `Finding results for "${searchQuery}"`,
    });

    // Clear search after submission
    setSearchQuery("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e as any);
    }
  };
  return <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">ReThread</span>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search for clothes, brands, sizes..." 
              className="pl-10 bg-muted/50 border-border/50 focus:bg-background transition-colors" 
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                
                // Only navigate home if completely cleared
                if (value === '') {
                  navigate('/');
                }
              }}
              onKeyPress={handleKeyPress}
            />
            <Button 
              type="submit" 
              size="sm" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
              variant="ghost"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          
          <Button variant="ghost" size="sm" className="hidden md:flex" asChild>
            <Link to="/sell">
              Sell
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to="/login">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Login</span>
            </Link>
          </Button>
          <Button variant="eco" size="sm" asChild>
            <Link to="/admin/login">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Admin</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </header>;
};
export default Header;