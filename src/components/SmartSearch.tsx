import React, { useState, useRef, useEffect } from 'react';
import { Search, Mic, Camera, Sparkles, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface SmartSearchProps {
  onSearch: (query: string) => void;
  onVoiceSearch?: () => void;
  onVisualSearch?: () => void;
  onAIRecommendation?: () => void;
}

const SmartSearch: React.FC<SmartSearchProps> = ({
  onSearch,
  onVoiceSearch,
  onVisualSearch,
  onAIRecommendation
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'vintage denim jacket',
    'black formal dress',
    'sustainable cotton t-shirt'
  ]);
  
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  // AI-powered search suggestions
  const aiSuggestions = [
    'winter coats under $100',
    'sustainable activewear',
    'vintage band t-shirts',
    'formal wear for job interviews',
    'boho style maxi dresses',
    'minimalist wardrobe essentials'
  ];

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      // Add to recent searches
      setRecentSearches(prev => [
        searchQuery,
        ...prev.filter(s => s !== searchQuery).slice(0, 4)
      ]);
      setShowSuggestions(false);
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    
    // Mock voice search functionality
    setTimeout(() => {
      setIsListening(false);
      const mockVoiceQuery = "black leather jacket vintage style";
      setQuery(mockVoiceQuery);
      handleSearch(mockVoiceQuery);
      toast({
        title: "Voice Search Complete",
        description: `Searched for: "${mockVoiceQuery}"`,
      });
    }, 2000);

    if (onVoiceSearch) onVoiceSearch();
  };

  const handleVisualSearch = () => {
    toast({
      title: "Visual Search",
      description: "Camera feature would open here to search by image",
    });
    if (onVisualSearch) onVisualSearch();
  };

  const handleAIRecommendation = () => {
    const randomSuggestion = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    setQuery(randomSuggestion);
    handleSearch(randomSuggestion);
    
    toast({
      title: "AI Recommendation",
      description: `Suggested: "${randomSuggestion}"`,
    });
    
    if (onAIRecommendation) onAIRecommendation();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    // Show suggestions when typing
    if (value.length > 0) {
      const filtered = aiSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main search bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search for clothing... (try natural language)"
          value={query}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => query.length > 0 && setShowSuggestions(true)}
          className="pl-10 pr-32 h-12 text-base border-2 border-border/50 focus:border-primary/50 rounded-xl bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-soft focus:shadow-glow"
        />
        
        {/* Clear button */}
        {query && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearSearch}
            className="absolute inset-y-0 right-24 w-8 h-8 my-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        {/* Action buttons */}
        <div className="absolute inset-y-0 right-2 flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVoiceSearch}
            disabled={isListening}
            className={`w-8 h-8 hover:bg-primary/10 ${isListening ? 'animate-pulse-glow' : ''}`}
            title="Voice Search"
          >
            <Mic className={`h-4 w-4 ${isListening ? 'text-primary' : 'text-muted-foreground'}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVisualSearch}
            className="w-8 h-8 hover:bg-primary/10"
            title="Visual Search"
          >
            <Camera className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAIRecommendation}
            className="w-8 h-8 hover:bg-primary/10 hover-glow"
            title="AI Recommendation"
          >
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
        <Card className="absolute top-14 left-0 right-0 z-50 p-4 shadow-neural border-border/50 bg-background/95 backdrop-blur-xl animate-fade-in-up">
          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">AI Suggestions</span>
              </div>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(suggestion);
                      handleSearch(suggestion);
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-accent/50 transition-colors flex items-center gap-2 group"
                  >
                    <Search className="h-3 w-3 text-muted-foreground group-hover:text-primary" />
                    <span className="group-hover:text-primary">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent searches */}
          {recentSearches.length > 0 && !query && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Recent Searches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors interactive"
                    onClick={() => {
                      setQuery(search);
                      handleSearch(search);
                    }}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Voice search indicator */}
      {isListening && (
        <div className="absolute top-14 left-0 right-0 z-40">
          <Card className="p-4 text-center bg-primary/5 border-primary/20 animate-scale-in">
            <div className="flex items-center justify-center gap-2 text-primary">
              <Mic className="h-5 w-5 animate-bounce-gentle" />
              <span className="text-sm font-medium">Listening...</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Say something like "black leather jacket vintage style"
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;