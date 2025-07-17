export interface ClothingCategory {
  id: string;
  name: string;
  subcategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  parentId: string;
}

export interface ClothingItem {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  sizes: Size[];
  materials: Material[];
  condition: Condition;
  price: number;
  originalPrice?: number;
  images: string[];
  brand: string;
  status: Status;
  tags: string[];
  description: string;
  measurements?: Measurements;
  fabricCare: string[];
  stockCount: number;
  dateAdded: Date;
  lastUpdated: Date;
  discount?: number;
  gender: Gender;
  occasion: Occasion;
  season: Season;
  fitType: FitType;
  printType: PrintType;
  styleCategory: StyleCategory;
  sleeveType?: SleeveType;
  necklineType?: NecklineType;
}

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '2XL' | '3XL' | 'Free Size' | '28' | '30' | '32' | '34' | '36' | '38' | '40' | '42';
export type Material = 'Cotton' | 'Denim' | 'Polyester' | 'Wool' | 'Silk' | 'Linen' | 'Leather' | 'Mixed' | 'Velvet' | 'Chiffon' | 'Satin' | 'Crepe' | 'Georgette' | 'Khadi' | 'Lycra' | 'Rayon';
export type Condition = 'Like New' | 'Excellent' | 'Good' | 'Gently Used' | 'Vintage';
export type Status = 'Available' | 'Sold' | 'Reserved' | 'Out of Stock';
export type Gender = 'Men' | 'Women' | 'Kids' | 'Unisex';
export type Occasion = 'Work' | 'Party' | 'Daily Wear' | 'Wedding' | 'Gym' | 'Beach' | 'Festival' | 'Casual' | 'Formal';
export type Season = 'Summer' | 'Monsoon' | 'Winter' | 'All Season';
export type FitType = 'Slim' | 'Regular' | 'Oversized' | 'Loose' | 'Fitted' | 'Relaxed' | 'Skinny' | 'Straight';
export type PrintType = 'Solid' | 'Striped' | 'Floral' | 'Graphic Print' | 'Abstract' | 'Polka Dots' | 'Checks' | 'Ethnic Print';
export type StyleCategory = 'Casual' | 'Formal' | 'Athleisure' | 'Party' | 'Boho' | 'Vintage' | 'Ethnic' | 'Minimalist' | 'Street Style';
export type SleeveType = 'Full Sleeve' | 'Half Sleeve' | 'Sleeveless' | '3/4 Sleeve' | 'Cold Shoulder' | 'Cap Sleeve';
export type NecklineType = 'Round' | 'V-neck' | 'Boat neck' | 'High neck' | 'Off-shoulder' | 'Square neck' | 'Collar' | 'Scoop neck';

export interface Measurements {
  chest?: number;
  waist?: number;
  hips?: number;
  length?: number;
  sleeves?: number;
  shoulders?: number;
}

export interface FilterOptions {
  categories: string[];
  subcategories: string[];
  sizes: Size[];
  materials: Material[];
  conditions: Condition[];
  priceRange: [number, number];
  brands: string[];
  status: Status[];
  tags: string[];
  inStock: boolean;
  gender: Gender[];
  occasion: Occasion[];
  season: Season[];
  fitType: FitType[];
  printType: PrintType[];
  styleCategory: StyleCategory[];
  sleeveType: SleeveType[];
  necklineType: NecklineType[];
}

export const CLOTHING_CATEGORIES: ClothingCategory[] = [
  // Men's Collection
  {
    id: 'mens-formal',
    name: "Men's Formal Wear",
    subcategories: [
      { id: 'formal-shirts', name: 'Formal Shirts', parentId: 'mens-formal' },
      { id: 'blazers', name: 'Blazers', parentId: 'mens-formal' },
      { id: 'dress-pants', name: 'Dress Pants', parentId: 'mens-formal' },
      { id: 'suits', name: 'Suits', parentId: 'mens-formal' },
      { id: 'ties', name: 'Ties', parentId: 'mens-formal' },
      { id: 'waistcoats', name: 'Waistcoats', parentId: 'mens-formal' }
    ]
  },
  {
    id: 'mens-casual',
    name: "Men's Casual Wear",
    subcategories: [
      { id: 'casual-shirts', name: 'Casual Shirts', parentId: 'mens-casual' },
      { id: 'polo-tshirts', name: 'Polo T-Shirts', parentId: 'mens-casual' },
      { id: 'henley-shirts', name: 'Henley Shirts', parentId: 'mens-casual' },
      { id: 'casual-trousers', name: 'Casual Trousers', parentId: 'mens-casual' },
      { id: 't-shirts', name: 'T-Shirts', parentId: 'mens-casual' }
    ]
  },
  {
    id: 'mens-traditional',
    name: "Men's Traditional Wear",
    subcategories: [
      { id: 'kurta-pajamas', name: 'Kurta Pajamas', parentId: 'mens-traditional' },
      { id: 'sherwanis', name: 'Sherwanis', parentId: 'mens-traditional' },
      { id: 'dhotis', name: 'Dhotis', parentId: 'mens-traditional' },
      { id: 'traditional-jackets', name: 'Traditional Jackets', parentId: 'mens-traditional' }
    ]
  },
  {
    id: 'mens-activewear',
    name: "Men's Active Wear",
    subcategories: [
      { id: 'track-pants', name: 'Track Pants', parentId: 'mens-activewear' },
      { id: 'joggers', name: 'Joggers', parentId: 'mens-activewear' },
      { id: 'sports-tshirts', name: 'Sports T-Shirts', parentId: 'mens-activewear' },
      { id: 'gym-shorts', name: 'Gym Shorts', parentId: 'mens-activewear' }
    ]
  },
  {
    id: 'mens-denim',
    name: "Men's Denim Collection",
    subcategories: [
      { id: 'mens-jeans', name: 'Jeans', parentId: 'mens-denim' },
      { id: 'denim-jackets', name: 'Denim Jackets', parentId: 'mens-denim' },
      { id: 'denim-shirts', name: 'Denim Shirts', parentId: 'mens-denim' }
    ]
  },
  {
    id: 'mens-outerwear',
    name: "Men's Outerwear",
    subcategories: [
      { id: 'hoodies', name: 'Hoodies', parentId: 'mens-outerwear' },
      { id: 'pullovers', name: 'Pullovers', parentId: 'mens-outerwear' },
      { id: 'jackets', name: 'Jackets', parentId: 'mens-outerwear' },
      { id: 'coats', name: 'Coats', parentId: 'mens-outerwear' }
    ]
  },
  // Women's Collection
  {
    id: 'womens-tops',
    name: "Women's Tops",
    subcategories: [
      { id: 'crop-tops', name: 'Crop Tops', parentId: 'womens-tops' },
      { id: 'blouses', name: 'Blouses', parentId: 'womens-tops' },
      { id: 'off-shoulder-tops', name: 'Off-shoulder Tops', parentId: 'womens-tops' },
      { id: 'cold-shoulder-tops', name: 'Cold-shoulder Tops', parentId: 'womens-tops' },
      { id: 'tank-tops', name: 'Tank Tops', parentId: 'womens-tops' }
    ]
  },
  {
    id: 'womens-traditional',
    name: "Women's Traditional Wear",
    subcategories: [
      { id: 'kurtis', name: 'Kurtis', parentId: 'womens-traditional' },
      { id: 'sarees', name: 'Sarees', parentId: 'womens-traditional' },
      { id: 'lehengas', name: 'Lehengas', parentId: 'womens-traditional' },
      { id: 'anarkali-dresses', name: 'Anarkali Dresses', parentId: 'womens-traditional' },
      { id: 'palazzo-sets', name: 'Palazzo Sets', parentId: 'womens-traditional' }
    ]
  },
  {
    id: 'womens-dresses',
    name: "Women's Dresses",
    subcategories: [
      { id: 'bodycon-dresses', name: 'Bodycon', parentId: 'womens-dresses' },
      { id: 'maxi-dresses', name: 'Maxi', parentId: 'womens-dresses' },
      { id: 'mini-dresses', name: 'Mini', parentId: 'womens-dresses' },
      { id: 'midi-dresses', name: 'Midi', parentId: 'womens-dresses' },
      { id: 'a-line-dresses', name: 'A-line', parentId: 'womens-dresses' },
      { id: 'wrap-dresses', name: 'Wrap Dresses', parentId: 'womens-dresses' }
    ]
  },
  {
    id: 'womens-bottoms',
    name: "Women's Bottoms",
    subcategories: [
      { id: 'palazzo-pants', name: 'Palazzo Pants', parentId: 'womens-bottoms' },
      { id: 'leggings', name: 'Leggings', parentId: 'womens-bottoms' },
      { id: 'jeggings', name: 'Jeggings', parentId: 'womens-bottoms' },
      { id: 'pencil-skirts', name: 'Pencil Skirts', parentId: 'womens-bottoms' },
      { id: 'denim-skirts', name: 'Denim Skirts', parentId: 'womens-bottoms' },
      { id: 'womens-jeans', name: 'Jeans', parentId: 'womens-bottoms' }
    ]
  },
  {
    id: 'womens-layering',
    name: "Women's Layering",
    subcategories: [
      { id: 'shrugs', name: 'Shrugs', parentId: 'womens-layering' },
      { id: 'cardigans', name: 'Cardigans', parentId: 'womens-layering' },
      { id: 'light-jackets', name: 'Light Jackets', parentId: 'womens-layering' },
      { id: 'kimonos', name: 'Kimonos', parentId: 'womens-layering' }
    ]
  },
  // Kids Collection
  {
    id: 'kids-infant',
    name: 'Infant Wear',
    subcategories: [
      { id: 'rompers', name: 'Rompers', parentId: 'kids-infant' },
      { id: 'onesies', name: 'Onesies', parentId: 'kids-infant' },
      { id: 'baby-sets', name: 'Baby Sets', parentId: 'kids-infant' },
      { id: 'sleep-suits', name: 'Sleep Suits', parentId: 'kids-infant' }
    ]
  },
  {
    id: 'kids-toddler',
    name: 'Toddler Clothing',
    subcategories: [
      { id: 'cartoon-tshirts', name: 'Cartoon T-Shirts', parentId: 'kids-toddler' },
      { id: 'dungarees', name: 'Dungarees', parentId: 'kids-toddler' },
      { id: 'frocks', name: 'Frocks', parentId: 'kids-toddler' },
      { id: 'shorts-sets', name: 'Shorts Sets', parentId: 'kids-toddler' }
    ]
  },
  {
    id: 'kids-school',
    name: 'School Wear',
    subcategories: [
      { id: 'school-uniforms', name: 'School Uniforms', parentId: 'kids-school' },
      { id: 'kids-formal-shirts', name: 'Formal Shirts', parentId: 'kids-school' },
      { id: 'school-trousers', name: 'School Trousers', parentId: 'kids-school' },
      { id: 'school-skirts', name: 'School Skirts', parentId: 'kids-school' }
    ]
  },
  // Footwear
  {
    id: 'footwear',
    name: 'Footwear',
    subcategories: [
      { id: 'formal-shoes', name: 'Formal Shoes', parentId: 'footwear' },
      { id: 'casual-sneakers', name: 'Casual Sneakers', parentId: 'footwear' },
      { id: 'ethnic-footwear', name: 'Ethnic Footwear', parentId: 'footwear' },
      { id: 'sandals', name: 'Sandals', parentId: 'footwear' },
      { id: 'boots', name: 'Boots', parentId: 'footwear' },
      { id: 'flats', name: 'Flats', parentId: 'footwear' }
    ]
  },
  // Accessories
  {
    id: 'bags',
    name: 'Bags Collection',
    subcategories: [
      { id: 'handbags', name: 'Handbags', parentId: 'bags' },
      { id: 'slings', name: 'Sling Bags', parentId: 'bags' },
      { id: 'backpacks', name: 'Backpacks', parentId: 'bags' },
      { id: 'clutches', name: 'Clutches', parentId: 'bags' },
      { id: 'tote-bags', name: 'Tote Bags', parentId: 'bags' }
    ]
  },
  {
    id: 'accessories',
    name: 'Fashion Accessories',
    subcategories: [
      { id: 'belts', name: 'Belts', parentId: 'accessories' },
      { id: 'scarves', name: 'Scarves', parentId: 'accessories' },
      { id: 'caps', name: 'Caps & Hats', parentId: 'accessories' },
      { id: 'jewelry', name: 'Fashion Jewelry', parentId: 'accessories' },
      { id: 'watches', name: 'Watches', parentId: 'accessories' }
    ]
  }
];

export const POPULAR_BRANDS = [
  'Zara', 'H&M', 'Uniqlo', 'Levi\'s', 'Nike', 'Adidas', 'Gap', 'Forever 21',
  'Mango', 'ASOS', 'Urban Outfitters', 'Biba', 'W', 'Global Desi', 'Fabindia',
  'Allen Solly', 'Van Heusen', 'Peter England', 'Raymond', 'Blackberrys',
  'United Colors of Benetton', 'Pepe Jeans', 'Lee', 'Wrangler', 'Jack & Jones',
  'Vero Moda', 'Only', 'AND', 'Chemistry', 'Aurelia', 'Janasya', 'Libas',
  'Vintage', 'Local Brand', 'Handloom', 'Designer Piece', 'Other'
];

export const GENDER_OPTIONS: Gender[] = ['Men', 'Women', 'Kids', 'Unisex'];
export const OCCASION_OPTIONS: Occasion[] = ['Work', 'Party', 'Daily Wear', 'Wedding', 'Gym', 'Beach', 'Festival', 'Casual', 'Formal'];
export const SEASON_OPTIONS: Season[] = ['Summer', 'Monsoon', 'Winter', 'All Season'];
export const FIT_TYPE_OPTIONS: FitType[] = ['Slim', 'Regular', 'Oversized', 'Loose', 'Fitted', 'Relaxed', 'Skinny', 'Straight'];
export const PRINT_TYPE_OPTIONS: PrintType[] = ['Solid', 'Striped', 'Floral', 'Graphic Print', 'Abstract', 'Polka Dots', 'Checks', 'Ethnic Print'];
export const STYLE_CATEGORY_OPTIONS: StyleCategory[] = ['Casual', 'Formal', 'Athleisure', 'Party', 'Boho', 'Vintage', 'Ethnic', 'Minimalist', 'Street Style'];
export const SLEEVE_TYPE_OPTIONS: SleeveType[] = ['Full Sleeve', 'Half Sleeve', 'Sleeveless', '3/4 Sleeve', 'Cold Shoulder', 'Cap Sleeve'];
export const NECKLINE_TYPE_OPTIONS: NecklineType[] = ['Round', 'V-neck', 'Boat neck', 'High neck', 'Off-shoulder', 'Square neck', 'Collar', 'Scoop neck'];

export const FABRIC_CARE_INSTRUCTIONS = [
  'Machine wash cold',
  'Hand wash only',
  'Dry clean only',
  'Tumble dry low',
  'Hang dry',
  'Iron on low heat',
  'Do not bleach',
  'Professional cleaning recommended'
];