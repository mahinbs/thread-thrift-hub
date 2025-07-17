import { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FilterOptions, 
  CLOTHING_CATEGORIES, 
  POPULAR_BRANDS,
  GENDER_OPTIONS,
  OCCASION_OPTIONS,
  SEASON_OPTIONS,
  FIT_TYPE_OPTIONS,
  PRINT_TYPE_OPTIONS,
  STYLE_CATEGORY_OPTIONS,
  SLEEVE_TYPE_OPTIONS,
  NECKLINE_TYPE_OPTIONS,
  Size,
  Material,
  Condition,
  Status
} from "@/types/clothing";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClear: () => void;
  itemCount: number;
}

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', 'Free Size', '28', '30', '32', '34', '36', '38', '40', '42'];
const MATERIALS: Material[] = ['Cotton', 'Denim', 'Polyester', 'Wool', 'Silk', 'Linen', 'Leather', 'Mixed', 'Velvet', 'Chiffon', 'Satin', 'Crepe', 'Georgette', 'Khadi', 'Lycra', 'Rayon'];
const CONDITIONS: Condition[] = ['Like New', 'Excellent', 'Good', 'Gently Used', 'Vintage'];
const STATUSES: Status[] = ['Available', 'Sold', 'Reserved'];

const FilterSidebar = ({ filters, onFiltersChange, onClear, itemCount }: FilterSidebarProps) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    gender: true,
    sizes: true,
    materials: false,
    conditions: false,
    price: true,
    brands: false,
    occasion: false,
    season: false,
    fitType: false,
    printType: false,
    styleCategory: false,
    sleeveType: false,
    necklineType: false
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = <T extends keyof FilterOptions>(
    key: T,
    value: FilterOptions[T]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = <T extends string>(
    key: keyof FilterOptions,
    value: T,
    currentArray: T[]
  ) => {
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilter(key, newArray as FilterOptions[keyof FilterOptions]);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.gender.length > 0) count++;
    if (filters.sizes.length > 0) count++;
    if (filters.materials.length > 0) count++;
    if (filters.conditions.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.occasion.length > 0) count++;
    if (filters.season.length > 0) count++;
    if (filters.fitType.length > 0) count++;
    if (filters.printType.length > 0) count++;
    if (filters.styleCategory.length > 0) count++;
    if (filters.sleeveType.length > 0) count++;
    if (filters.necklineType.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) count++;
    return count;
  };

  return (
    <div className="glass-card p-6 h-fit sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <Badge variant="secondary" className="ml-2">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-muted-foreground">
          {itemCount} items found
        </p>
      </div>

      <ScrollArea className="max-h-[calc(100vh-200px)]">
        <div className="space-y-6">
          {/* Gender */}
          <Collapsible open={openSections.gender} onOpenChange={() => toggleSection('gender')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg">
              <Label className="font-medium">Gender</Label>
              {openSections.gender ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map(gender => (
                  <Button
                    key={gender}
                    variant={filters.gender.includes(gender) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleArrayFilter('gender', gender, filters.gender)}
                    className="h-8 px-3"
                  >
                    {gender}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Categories */}
          <Collapsible open={openSections.categories} onOpenChange={() => toggleSection('categories')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg">
              <Label className="font-medium">Categories</Label>
              {openSections.categories ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              {CLOTHING_CATEGORIES.map(category => (
                <div key={category.id}>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={category.id}
                      checked={filters.categories.includes(category.id)}
                      onCheckedChange={() => toggleArrayFilter('categories', category.id, filters.categories)}
                    />
                    <Label htmlFor={category.id} className="text-sm font-medium">
                      {category.name}
                    </Label>
                  </div>
                  {filters.categories.includes(category.id) && (
                    <div className="ml-6 mt-2 space-y-2">
                      {category.subcategories.map(sub => (
                        <div key={sub.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={sub.id}
                            checked={filters.subcategories.includes(sub.id)}
                            onCheckedChange={() => toggleArrayFilter('subcategories', sub.id, filters.subcategories)}
                          />
                          <Label htmlFor={sub.id} className="text-sm text-muted-foreground">
                            {sub.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Sizes */}
          <Collapsible open={openSections.sizes} onOpenChange={() => toggleSection('sizes')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg">
              <Label className="font-medium">Sizes</Label>
              {openSections.sizes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="flex flex-wrap gap-2">
                {SIZES.map(size => (
                  <Button
                    key={size}
                    variant={filters.sizes.includes(size) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleArrayFilter('sizes', size, filters.sizes)}
                    className="h-8 px-3"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Price Range */}
          <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg">
              <Label className="font-medium">Price Range</Label>
              {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
              <div className="px-2">
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>₹{filters.priceRange[0]}</span>
                  <span>₹{filters.priceRange[1]}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Materials */}
          <Collapsible open={openSections.materials} onOpenChange={() => toggleSection('materials')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg">
              <Label className="font-medium">Materials</Label>
              {openSections.materials ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {MATERIALS.map(material => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={material}
                    checked={filters.materials.includes(material)}
                    onCheckedChange={() => toggleArrayFilter('materials', material, filters.materials)}
                  />
                  <Label htmlFor={material} className="text-sm">
                    {material}
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Conditions */}
          <Collapsible open={openSections.conditions} onOpenChange={() => toggleSection('conditions')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg">
              <Label className="font-medium">Condition</Label>
              {openSections.conditions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {CONDITIONS.map(condition => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={condition}
                    checked={filters.conditions.includes(condition)}
                    onCheckedChange={() => toggleArrayFilter('conditions', condition, filters.conditions)}
                  />
                  <Label htmlFor={condition} className="text-sm">
                    {condition}
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Brands */}
          <Collapsible open={openSections.brands} onOpenChange={() => toggleSection('brands')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg">
              <Label className="font-medium">Brands</Label>
              {openSections.brands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-2">
              {POPULAR_BRANDS.slice(0, 8).map(brand => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={brand}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={() => toggleArrayFilter('brands', brand, filters.brands)}
                  />
                  <Label htmlFor={brand} className="text-sm">
                    {brand}
                  </Label>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Style Category */}
          <Collapsible open={openSections.styleCategory} onOpenChange={() => toggleSection('styleCategory')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg">
              <Label className="font-medium">Style</Label>
              {openSections.styleCategory ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="flex flex-wrap gap-2">
                {STYLE_CATEGORY_OPTIONS.map(style => (
                  <Button
                    key={style}
                    variant={filters.styleCategory.includes(style) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleArrayFilter('styleCategory', style, filters.styleCategory)}
                    className="h-8 px-3"
                  >
                    {style}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Occasion */}
          <Collapsible open={openSections.occasion} onOpenChange={() => toggleSection('occasion')}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-muted/50 rounded-lg">
              <Label className="font-medium">Occasion</Label>
              {openSections.occasion ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              <div className="flex flex-wrap gap-2">
                {OCCASION_OPTIONS.map(occasion => (
                  <Button
                    key={occasion}
                    variant={filters.occasion.includes(occasion) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleArrayFilter('occasion', occasion, filters.occasion)}
                    className="h-8 px-3"
                  >
                    {occasion}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* In Stock Only */}
          <div className="flex items-center space-x-2 p-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => updateFilter('inStock', !!checked)}
            />
            <Label htmlFor="inStock" className="text-sm font-medium">
              In Stock Only
            </Label>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default FilterSidebar;