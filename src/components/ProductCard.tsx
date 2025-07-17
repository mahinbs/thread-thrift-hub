import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: string;
  condition: string;
  category: string;
}

const ProductCard = ({ 
  name, 
  brand, 
  price, 
  originalPrice, 
  image, 
  size, 
  condition, 
  category 
}: ProductCardProps) => {
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <Card className="group cursor-pointer overflow-hidden border-border/50 hover:border-primary/20">
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Status Badge */}
        <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary">
          {condition}
        </Badge>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <Badge variant="destructive" className="absolute top-3 right-3">
            -{discount}%
          </Badge>
        )}

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/80 hover:bg-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">{brand}</span>
            <span className="text-xs text-muted-foreground">Size {size}</span>
          </div>
          
          <h3 className="font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {name}
          </h3>
          
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-foreground">${price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">${originalPrice}</span>
            )}
          </div>
          
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button variant="earth" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <ShoppingBag className="h-4 w-4 mr-2" />
          Show Interest
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;