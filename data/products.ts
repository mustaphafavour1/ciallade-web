// Unsplash helper — swap to cloudinary() from lib/cloudinary.ts when ready
const u = (id: string, w = 800, h = 1067) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: 'Tops' | 'Bottoms' | 'Headwear' | 'Jackets' | 'Statement Pieces';
  price: number;
  currency: 'NGN';
  images: string[];
  description: string;
  sizes: string[];
  featured: boolean;
  tags?: string[];
};

export const products: Product[] = [
  {
    id: '001',
    slug: 'ochre-linen-top',
    name: 'Ochre Linen Top',
    category: 'Tops',
    price: 55000,
    currency: 'NGN',
    images: [u('photo-1529139574466-a303027c1d8b')],
    description: 'Structured linen top in warm ochre. Cut for confidence, finished with precision.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: true,
    tags: ['ochre', 'linen', 'top', 'warm', 'minimal'],
  },
  {
    id: '002',
    slug: 'dark-wood-oversized-jacket',
    name: 'Dark Wood Oversized Jacket',
    category: 'Jackets',
    price: 145000,
    currency: 'NGN',
    images: [u('photo-1591047139829-d91aecb6caea')],
    description: 'Oversized silhouette in deep dark wood tones. The jacket that speaks before you do.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    featured: true,
    tags: ['dark wood', 'brown', 'jacket', 'oversized', 'wool', 'statement'],
  },
  {
    id: '003',
    slug: 'woven-cap-caramel',
    name: 'Woven Cap — Caramel',
    category: 'Headwear',
    price: 35000,
    currency: 'NGN',
    images: [u('photo-1588850561407-ed78c282e89b', 800, 800)],
    description: 'Hand-woven cap in rich caramel tones. One size, every story.',
    sizes: ['One Size'],
    featured: true,
    tags: ['caramel', 'brown', 'cap', 'headwear', 'raffia', 'summer'],
  },
  {
    id: '004',
    slug: 'maroon-wide-leg-trousers',
    name: 'Maroon Wide-Leg Trousers',
    category: 'Bottoms',
    price: 78000,
    currency: 'NGN',
    images: [u('photo-1509631179647-0177331693ae')],
    description: 'Wide-leg cut in deep maroon. Effortless movement, deliberate presence.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: false,
    tags: ['maroon', 'red', 'trousers', 'bottoms', 'wide-leg', 'viscose'],
  },
  {
    id: '005',
    slug: 'almond-draped-shirt',
    name: 'Almond Draped Shirt',
    category: 'Tops',
    price: 62000,
    currency: 'NGN',
    images: [u('photo-1515886657613-9f3515b0c78f')],
    description: 'Fluid draped shirt in almond cream. Softness with structure.',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    tags: ['almond', 'cream', 'shirt', 'top', 'silk', 'draped', 'soft'],
  },
  {
    id: '006',
    slug: 'autumn-orange-bucket-hat',
    name: 'Autumn Orange Bucket Hat',
    category: 'Headwear',
    price: 28000,
    currency: 'NGN',
    images: [u('photo-1556306535-38febf6782dc', 800, 800)],
    description: 'Bold bucket hat in autumn orange. Make your entrance from the crown down.',
    sizes: ['S/M', 'L/XL'],
    featured: false,
    tags: ['orange', 'bucket hat', 'headwear', 'cotton', 'bold', 'summer'],
  },
  {
    id: '007',
    slug: 'coffee-linen-shorts',
    name: 'Coffee Linen Shorts',
    category: 'Bottoms',
    price: 45000,
    currency: 'NGN',
    images: [u('photo-1485230895905-ec40ba36b9bc')],
    description: 'Tailored linen shorts in warm coffee. Relaxed silhouette, refined finish.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    featured: false,
    tags: ['coffee', 'brown', 'shorts', 'bottoms', 'linen', 'relaxed', 'summer'],
  },
  {
    id: '008',
    slug: 'byra-cap-nature-brown',
    name: 'BYRA Cap — Nature Brown',
    category: 'Headwear',
    price: 32000,
    currency: 'NGN',
    images: [u('photo-1576871337622-98d48d1cf531', 800, 800)],
    description:
      'Signature BYRA cap embroidered with the geometric line motif. A crown for the self-defined.',
    sizes: ['One Size'],
    featured: true,
    tags: ['nature brown', 'brown', 'cap', 'headwear', 'byra', 'embroidered', 'signature'],
  },
  {
    id: '009',
    slug: 'reinvent-statement-coat',
    name: 'Reinvent Statement Coat',
    category: 'Statement Pieces',
    price: 180000,
    currency: 'NGN',
    images: [u('photo-1539109136881-3be0616acf4b')],
    description: 'The centerpiece. An ochre statement coat cut to command every room.',
    sizes: ['S', 'M', 'L', 'XL'],
    featured: true,
    tags: ['ochre', 'coat', 'statement', 'wool', 'formal', 'occasion'],
  },
  {
    id: '010',
    slug: 'structured-boxy-tee',
    name: 'Structured Boxy Tee',
    category: 'Tops',
    price: 38000,
    currency: 'NGN',
    images: [u('photo-1503342394128-c104d54dba01')],
    description: 'Heavyweight jersey tee in a boxy silhouette. The foundation of every look.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    featured: false,
    tags: ['tee', 't-shirt', 'top', 'cotton', 'boxy', 'everyday', 'minimal'],
  },
];

export const featuredProducts = products.filter((p) => p.featured);

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter((p) => p.category === category);
}

export function formatPrice(price: number): string {
  return `₦${price.toLocaleString('en-NG')}`;
}
