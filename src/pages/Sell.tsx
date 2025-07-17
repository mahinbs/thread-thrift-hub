import { useState } from "react";
import { Upload, Camera, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CLOTHING_CATEGORIES, POPULAR_BRANDS, Size, Material, Condition } from "@/types/clothing";

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
const MATERIALS: Material[] = ['Cotton', 'Denim', 'Polyester', 'Wool', 'Silk', 'Linen', 'Leather', 'Mixed'];
const CONDITIONS: Condition[] = ['Like New', 'Excellent', 'Good', 'Gently Used', 'Vintage'];

const Sell = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    brand: '',
    price: '',
    originalPrice: '',
    condition: '',
    sizes: [] as Size[],
    materials: [] as Material[],
    tags: '',
    images: [] as string[]
  });
  
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field: 'sizes' | 'materials', value: Size | Material) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'sizes' 
        ? prev.sizes.includes(value as Size)
          ? prev.sizes.filter(item => item !== value)
          : [...prev.sizes, value as Size]
        : prev.materials.includes(value as Material)
          ? prev.materials.filter(item => item !== value)
          : [...prev.materials, value as Material]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Item submitted!",
      description: "We'll review your item and get back to you within 24 hours.",
    });
    // Reset form
    setFormData({
      title: '',
      description: '',
      category: '',
      subCategory: '',
      brand: '',
      price: '',
      originalPrice: '',
      condition: '',
      sizes: [],
      materials: [],
      tags: '',
      images: []
    });
  };

  const selectedCategory = CLOTHING_CATEGORIES.find(cat => cat.id === formData.category);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Sell Your Clothes
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Give your pre-loved clothes a new life! List your items and let someone else discover their next favorite piece.
          </p>
        </div>

        {/* Selling Process Steps */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            { step: 1, title: "List Your Item", description: "Fill out details about your clothing piece" },
            { step: 2, title: "We Review", description: "Our team verifies quality and authenticity" },
            { step: 3, title: "Get Paid", description: "Receive payment when your item sells" }
          ].map((item) => (
            <Card key={item.step} className="glass-card text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sell Form */}
        <Card className="glass-card max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">List Your Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Item Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Vintage Levi's Denim Jacket"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Select value={formData.brand} onValueChange={(value) => handleInputChange('brand', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_BRANDS.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category Selection */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CLOTHING_CATEGORIES.map(category => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedCategory && (
                  <div className="space-y-2">
                    <Label htmlFor="subCategory">Sub-category *</Label>
                    <Select value={formData.subCategory} onValueChange={(value) => handleInputChange('subCategory', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sub-category" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory.subcategories.map(sub => (
                          <SelectItem key={sub.id} value={sub.id}>{sub.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Selling Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originalPrice">Original Price (₹)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                    placeholder="0 (optional)"
                  />
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label>Condition *</Label>
                <div className="flex flex-wrap gap-2">
                  {CONDITIONS.map(condition => (
                    <Button
                      key={condition}
                      type="button"
                      variant={formData.condition === condition ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInputChange('condition', condition)}
                    >
                      {condition}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <Label>Available Sizes</Label>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(size => (
                    <Button
                      key={size}
                      type="button"
                      variant={formData.sizes.includes(size) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayField('sizes', size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Materials */}
              <div className="space-y-2">
                <Label>Materials</Label>
                <div className="flex flex-wrap gap-2">
                  {MATERIALS.map(material => (
                    <Button
                      key={material}
                      type="button"
                      variant={formData.materials.includes(material) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayField('materials', material)}
                    >
                      {material}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe the item's condition, fit, styling, any flaws, etc."
                  className="min-h-[100px]"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="e.g., vintage, summer, formal (comma separated)"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Photos</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Upload up to 5 photos</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Include front, back, tag, and any detail shots
                  </p>
                  <Button type="button" variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Photos
                  </Button>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions and confirm this item is authentic and in good condition
                </Label>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" size="lg">
                Submit Item for Review
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          {[
            { title: "Easy Process", description: "Simple listing with our guided form" },
            { title: "Fair Pricing", description: "Get competitive prices for quality items" },
            { title: "Sustainable", description: "Help reduce fashion waste" }
          ].map((benefit, index) => (
            <Card key={index} className="glass-card text-center">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Sell;