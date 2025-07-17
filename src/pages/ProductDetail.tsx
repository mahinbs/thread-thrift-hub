import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, ShoppingBag, Star, Zap, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { sampleClothingItems } from "@/data/sampleClothingData";
import { ClothingItem } from "@/types/clothing";
import Header from "@/components/Header";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = sampleClothingItems.find(item => item.id === id);

  useEffect(() => {
    if (!product) {
      navigate('/collections');
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
  const isOutOfStock = product.stockCount === 0 || product.status === 'Out of Stock';

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

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
    });
  };

  const handleShowInterest = () => {
    toast({
      title: "Interest Shown!",
      description: "We'll contact you soon with purchase details.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Link Copied!",
      description: "Product link copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Collections
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <AspectRatio ratio={3/4}>
                <img
                  src={product.images[currentImageIndex] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                
                {discount > 0 && (
                  <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                    -{discount}%
                  </Badge>
                )}
                
                {isOutOfStock && (
                  <Badge variant="destructive" className="absolute top-4 right-4">
                    Out of Stock
                  </Badge>
                )}
              </AspectRatio>
            </div>
            
            {/* Image Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
                  <h1 className="text-2xl font-bold text-foreground">{product.title}</h1>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlist}
                    className={isWishlisted ? 'text-red-500' : ''}
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-primary">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-muted-foreground line-through">₹{product.originalPrice}</span>
                )}
              </div>
            </div>

            <Separator />

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Condition</h3>
                <Badge className={`${getConditionColor(product.condition)}`} variant="outline">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  {product.condition}
                </Badge>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Available Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size, index) => (
                    <Badge key={index} variant="secondary">
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material, index) => (
                    <Badge key={index} variant="outline">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              {product.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Actions */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full"
                onClick={handleShowInterest}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? (
                  'Out of Stock'
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-2" />
                    Show Interest
                  </>
                )}
              </Button>
              
              <p className="text-sm text-muted-foreground text-center">
                {product.stockCount > 0 && product.stockCount <= 2 
                  ? `Only ${product.stockCount} left in stock!`
                  : 'Available for purchase'
                }
              </p>
            </div>

            {/* Additional Info */}
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Product Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Category:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sub-category:</span>
                  <span>{product.subCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span>{product.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Occasion:</span>
                  <span>{product.occasion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Season:</span>
                  <span>{product.season}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;