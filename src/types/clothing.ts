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
}

export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';
export type Material = 'Cotton' | 'Denim' | 'Polyester' | 'Wool' | 'Silk' | 'Linen' | 'Leather' | 'Mixed';
export type Condition = 'Like New' | 'Excellent' | 'Good' | 'Gently Used' | 'Vintage';
export type Status = 'Available' | 'Sold' | 'Reserved' | 'Out of Stock';

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
}

export const CLOTHING_CATEGORIES: ClothingCategory[] = [
  {
    id: 'tops',
    name: 'Tops',
    subcategories: [
      { id: 't-shirts', name: 'T-Shirts', parentId: 'tops' },
      { id: 'shirts', name: 'Shirts', parentId: 'tops' },
      { id: 'blouses', name: 'Blouses', parentId: 'tops' },
      { id: 'tank-tops', name: 'Tank Tops', parentId: 'tops' },
      { id: 'sweaters', name: 'Sweaters', parentId: 'tops' }
    ]
  },
  {
    id: 'bottoms',
    name: 'Bottoms',
    subcategories: [
      { id: 'jeans', name: 'Jeans', parentId: 'bottoms' },
      { id: 'trousers', name: 'Trousers', parentId: 'bottoms' },
      { id: 'shorts', name: 'Shorts', parentId: 'bottoms' },
      { id: 'skirts', name: 'Skirts', parentId: 'bottoms' }
    ]
  },
  {
    id: 'outerwear',
    name: 'Outerwear',
    subcategories: [
      { id: 'jackets', name: 'Jackets', parentId: 'outerwear' },
      { id: 'hoodies', name: 'Hoodies', parentId: 'outerwear' },
      { id: 'coats', name: 'Coats', parentId: 'outerwear' },
      { id: 'blazers', name: 'Blazers', parentId: 'outerwear' }
    ]
  },
  {
    id: 'dresses',
    name: 'Dresses',
    subcategories: [
      { id: 'casual-dresses', name: 'Casual', parentId: 'dresses' },
      { id: 'formal-dresses', name: 'Formal', parentId: 'dresses' },
      { id: 'party-dresses', name: 'Party', parentId: 'dresses' }
    ]
  },
  {
    id: 'footwear',
    name: 'Footwear',
    subcategories: [
      { id: 'sneakers', name: 'Sneakers', parentId: 'footwear' },
      { id: 'sandals', name: 'Sandals', parentId: 'footwear' },
      { id: 'boots', name: 'Boots', parentId: 'footwear' },
      { id: 'formal-shoes', name: 'Formal Shoes', parentId: 'footwear' }
    ]
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subcategories: [
      { id: 'scarves', name: 'Scarves', parentId: 'accessories' },
      { id: 'hats', name: 'Hats', parentId: 'accessories' },
      { id: 'belts', name: 'Belts', parentId: 'accessories' },
      { id: 'bags', name: 'Bags', parentId: 'accessories' }
    ]
  }
];

export const POPULAR_BRANDS = [
  'Zara', 'H&M', 'Uniqlo', 'Levi\'s', 'Nike', 'Adidas', 'Gap', 'Forever 21',
  'Mango', 'ASOS', 'Urban Outfitters', 'Vintage', 'Local Brand', 'Other'
];

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