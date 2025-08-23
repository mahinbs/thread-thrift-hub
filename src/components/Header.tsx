import { Search, User, ShoppingBag, Menu, Camera, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut, hasRole } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const checkAdminRole = async () => {
      if (user && hasRole) {
        try {
          const adminRole = await hasRole('admin');
          setIsAdmin(adminRole);
        } catch (error) {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdminRole();
  }, [user, hasRole]);

  // Compute display name for logged-in user
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Account';

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
  return <header className="sticky top-0 z-50 w-full glass-morphism border-b border-primary/20 shadow-neural">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Enhanced Logo */}
        <Link to="/" className="flex items-center space-x-3 hover-lift group">
          <div className="relative">
            <ShoppingBag className="h-8 w-8 text-primary animate-neon-pulse" />
            <div className="absolute inset-0 h-8 w-8 bg-primary/20 rounded-full blur-md group-hover:bg-primary/40 transition-all"></div>
          </div>
          <span className="text-2xl font-black gradient-text tracking-tight">Drape</span>
          <span className="text-xs bg-gradient-neon text-white px-2 py-1 rounded-full font-bold">AI</span>
        </Link>

        {/* Enhanced Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <div className="relative glass-morphism rounded-2xl overflow-hidden">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary" />
              <Input 
                type="search" 
                placeholder="Search with AI magic ✨ Try 'vintage denim' or 'summer vibes'" 
                className="pl-12 pr-20 h-12 bg-transparent border-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground font-medium" 
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
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-4 bg-gradient-primary text-primary-foreground hover:scale-105"
                variant="default"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          <Button variant="glass" size="sm" className="hidden md:flex hover-tilt font-semibold" asChild>
            <Link to="/scan">
              <Camera className="h-4 w-4 mr-2" />
              📱 Scan
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="hover-tilt" asChild>
            <Link to="/sell">
              💰 Sell
            </Link>
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hover-tilt">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline ml-2 font-semibold">{displayName}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard">Admin Panel</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" className="hover-tilt" asChild>
              <Link to="/auth">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline ml-2 font-semibold">Login</span>
              </Link>
            </Button>
          )}
          
          {!user && (
            <Button variant="neon" size="sm" className="hover-tilt font-bold" asChild>
              <Link to="/auth">
                <ShoppingBag className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Admin Login</span>
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </header>;
};
export default Header;