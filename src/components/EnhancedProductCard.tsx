import { useState } from "react";
import { Heart, Eye, ShoppingBag, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ClothingItem } from "@/types/clothing";

interface EnhancedProductCardProps extends ClothingItem {
  onWishlist?: (id: string) => void;
  onQuickView?: (id: string) => void;
  onShowInterest?: (id: string) => void;
  isWishlisted?: boolean;
}

const EnhancedProductCard = ({
  id,
  title,
  brand,
  price,
  originalPrice,
  images,
  sizes,
  condition,
  status,
  stockCount,
  tags,
  onWishlist,
  onQuickView,
  onShowInterest,
  isWishlisted = false
}: EnhancedProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const isLowStock = stockCount <= 2 && stockCount > 0;
  const isOutOfStock = stockCount === 0 || status === 'Out of Stock';

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Like New': return 'bg-green-500/10 text-green-700 border-green-200';
      case 'Excellent': return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'Good': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'Gently Used': return 'bg-orange-500/10 text-orange-700 border-orange-200';
      case 'Vintage': return 'bg-purple-500/10 text-purple-700 border-purple-200';
      default: return 'bg-muted';
    }
  };

  const getStatusBadge = () => {
    if (isOutOfStock) {
      return <Badge variant="destructive" className="absolute top-2 right-2">Out of Stock</Badge>;
    }
    if (isLowStock) {
      return <Badge variant="secondary" className="absolute top-2 right-2 bg-orange-500/10 text-orange-700">Only {stockCount} left!</Badge>;
    }
    if (status === 'Reserved') {
      return <Badge variant="secondary" className="absolute top-2 right-2 bg-yellow-500/10 text-yellow-700">Reserved</Badge>;
    }
    return null;
  };

  return (
    <Card 
      className="masonry-item glass-card hover-lift group cursor-pointer relative overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="relative overflow-hidden">
        <AspectRatio ratio={3/4}>
          <img
            src={images[currentImageIndex] || images[0] || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&auto=format"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&auto=format";
            }}
          />
          
          {/* Image Navigation Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
              {images.slice(0, 4).map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                />
              ))}
            </div>
          )}
          
          {/* Overlay Actions */}
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              size="sm"
              variant="secondary"
              className="glass-effect"
              onClick={(e) => {
                e.stopPropagation();
                onQuickView?.(id);
              }}
            >
              <Eye className="h-4 w-4 mr-1" />
              Quick View
            </Button>
          </div>
        </AspectRatio>

        {/* Top Badges */}
        {discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            -{discount}%
          </Badge>
        )}
        
        {getStatusBadge()}

        {/* Wishlist Button */}
        <Button
          size="sm"
          variant="ghost"
          className={`absolute top-2 right-12 glass-effect transition-all duration-300 ${
            isWishlisted ? 'text-red-500' : 'text-white hover:text-red-500'
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onWishlist?.(id);
          }}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Brand and Title */}
        <div>
          <p className="text-sm text-muted-foreground font-medium">{brand}</p>
          <h3 className="font-semibold text-foreground line-clamp-2 leading-tight">
            {title}
          </h3>
        </div>

        {/* Sizes */}
        <div className="flex flex-wrap gap-1">
          {sizes.slice(0, 4).map((size, index) => (
            <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
              {size}
            </Badge>
          ))}
          {sizes.length > 4 && (
            <Badge variant="secondary" className="text-xs px-2 py-1">
              +{sizes.length - 4}
            </Badge>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">₹{price}</span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>
          )}
        </div>

        {/* Condition */}
        <Badge className={`w-fit ${getConditionColor(condition)}`} variant="outline">
          {condition}
        </Badge>

        {/* Action Button */}
        <Button
          className="w-full glass-effect hover-glow"
          onClick={(e) => {
            e.stopPropagation();
            onShowInterest?.(id);
          }}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? (
            'Out of Stock'
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              Show Interest
            </>
          )}
        </Button>
      </div>

      {/* Floating Elements */}
      {condition === 'Like New' && (
        <div className="absolute top-1/2 left-1 transform -translate-y-1/2">
          <div className="bg-primary/20 backdrop-blur-sm rounded-full p-1">
            <Star className="h-3 w-3 text-primary fill-current" />
          </div>
        </div>
      )}
    </Card>
  );
};

export default EnhancedProductCard;